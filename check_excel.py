import openpyxl

wb = openpyxl.load_workbook('48 NGÀY LẤY GỐC TIẾNG ANH.xlsx')
sheet = wb.active

with open('excel_out.txt', 'w', encoding='utf-8') as f:
    for row in range(1, 20):
        cell = sheet.cell(row=row, column=3) # Column C is typically "BÀI GIẢNG"
        val = cell.value
        hyperlink = cell.hyperlink.target if cell.hyperlink else None
        f.write(f"Row {row}: value={val}, hyperlink={hyperlink}\n")
