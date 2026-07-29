from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models
from database import get_db
from auth import get_current_user
import os
import datetime
from vnpay_utils import vnpay

router = APIRouter(tags=["Checkout"])

class CoinPurchaseRequest(BaseModel):
    amount: int

VNPAY_TMN_CODE = os.environ.get("VNPAY_TMN_CODE", "TEST_TMN_CODE")
VNPAY_HASH_SECRET = os.environ.get("VNPAY_HASH_SECRET", "TEST_HASH_SECRET")
VNPAY_URL = os.environ.get("VNPAY_URL", "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html")
VNPAY_RETURN_URL = os.environ.get("VNPAY_RETURN_URL", "http://localhost:5173/payment-return")

def get_client_ip(request: Request):
    return request.client.host if request.client else "127.0.0.1"

@router.post("/checkout/course/{course_id}")
def checkout_course(course_id: str, request: Request, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    if course.price == 0:
        return {"message": "Course is free", "success": True}
        
    # Check if already purchased
    existing_order = db.query(models.Order).filter(
        models.Order.user_id == current_user.id,
        models.Order.course_id == course_id,
        models.Order.status == 'completed'
    ).first()
    
    if existing_order:
        raise HTTPException(status_code=400, detail="Course already purchased")
        
    # Create Pending Order
    order = models.Order(
        user_id=current_user.id,
        course_id=course_id,
        amount=course.price,
        status='pending'
    )
    db.add(order)
    db.commit()
    
    # Create VNPay URL
    vnp = vnpay()
    vnp.requestData['vnp_Version'] = '2.1.0'
    vnp.requestData['vnp_Command'] = 'pay'
    vnp.requestData['vnp_TmnCode'] = VNPAY_TMN_CODE
    vnp.requestData['vnp_Amount'] = str(int(course.price * 100))
    vnp.requestData['vnp_CurrCode'] = 'VND'
    vnp.requestData['vnp_TxnRef'] = order.id
    vnp.requestData['vnp_OrderInfo'] = f'Thanh toan khoa hoc {course.title}'
    vnp.requestData['vnp_OrderType'] = 'other'
    vnp.requestData['vnp_Locale'] = 'vn'
    vnp.requestData['vnp_CreateDate'] = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    vnp.requestData['vnp_IpAddr'] = get_client_ip(request)
    vnp.requestData['vnp_ReturnUrl'] = VNPAY_RETURN_URL
    
    vnpay_payment_url = vnp.get_payment_url(VNPAY_URL, VNPAY_HASH_SECRET)
    
    return {"message": "Redirect to VNPay", "success": True, "payment_url": vnpay_payment_url}

@router.post("/checkout/coins")
def checkout_coins(req: CoinPurchaseRequest, request: Request, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
        
    price_vnd = req.amount * 200
    
    order = models.Order(
        user_id=current_user.id,
        amount=price_vnd,
        status='pending'
    )
    db.add(order)
    db.commit()
    
    vnp = vnpay()
    vnp.requestData['vnp_Version'] = '2.1.0'
    vnp.requestData['vnp_Command'] = 'pay'
    vnp.requestData['vnp_TmnCode'] = VNPAY_TMN_CODE
    vnp.requestData['vnp_Amount'] = str(int(price_vnd * 100))
    vnp.requestData['vnp_CurrCode'] = 'VND'
    vnp.requestData['vnp_TxnRef'] = order.id
    vnp.requestData['vnp_OrderInfo'] = f'Nap {req.amount} Xu'
    vnp.requestData['vnp_OrderType'] = 'other'
    vnp.requestData['vnp_Locale'] = 'vn'
    vnp.requestData['vnp_CreateDate'] = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    vnp.requestData['vnp_IpAddr'] = get_client_ip(request)
    vnp.requestData['vnp_ReturnUrl'] = VNPAY_RETURN_URL
    
    vnpay_payment_url = vnp.get_payment_url(VNPAY_URL, VNPAY_HASH_SECRET)
    
    return {"message": "Redirect to VNPay", "success": True, "payment_url": vnpay_payment_url}

@router.get("/checkout/vnpay_return")
def vnpay_return(request: Request, db: Session = Depends(get_db)):
    inputData = dict(request.query_params)
    vnp = vnpay()
    vnp.responseData = inputData
    
    order_id = inputData.get('vnp_TxnRef')
    vnp_ResponseCode = inputData.get('vnp_ResponseCode')
    
    if vnp.validate_response(VNPAY_HASH_SECRET):
        order = db.query(models.Order).filter(models.Order.id == order_id).first()
        if not order:
            return {"success": False, "message": "Không tìm thấy mã đơn hàng"}
            
        if vnp_ResponseCode == "00":
            if order.status != 'completed':
                order.status = 'completed'
                # If it was a coin purchase (no course_id)
                if order.course_id is None:
                    # amount was in VND, coins = amount / 200
                    coins = int(order.amount / 200)
                    user = db.query(models.User).filter(models.User.id == order.user_id).first()
                    if user:
                        user.coins += coins
                db.commit()
            return {"success": True, "message": "Thanh toán thành công"}
        else:
            if order.status != 'completed':
                order.status = 'failed'
                db.commit()
            return {"success": False, "message": "Thanh toán bị hủy hoặc thất bại"}
    else:
        return {"success": False, "message": "Sai chữ ký bảo mật"}
