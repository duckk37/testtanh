import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';
import { API_URL } from '../config';

const Certificate = ({ courseId }) => {
  const certificateRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [certData, setCertData] = useState(null);

  const fetchAndDownload = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/certificates/generate?course_id=${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch certificate data');
      
      const data = await res.json();
      setCertData(data);
      
      // Allow React to render the hidden certificate div
      setTimeout(async () => {
        if (certificateRef.current) {
          const canvas = await html2canvas(certificateRef.current, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
          });
          
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(`Certificate_${data.course_title}.pdf`);
        }
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error(err);
      alert('Lỗi tải chứng chỉ!');
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={fetchAndDownload}
        disabled={loading}
        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
      >
        <Download size={18} />
        {loading ? 'Đang tạo PDF...' : 'Tải Chứng Chỉ (PDF)'}
      </button>

      {/* Hidden Certificate Template */}
      {certData && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
          <div 
            ref={certificateRef} 
            style={{ 
              width: '1122px', 
              height: '793px', 
              backgroundColor: '#0f172a',
              color: 'white',
              fontFamily: 'sans-serif',
              position: 'relative',
              padding: '40px'
            }}
          >
            <div style={{ border: '10px solid #eab308', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h1 style={{ fontSize: '60px', fontWeight: 'bold', marginBottom: '20px' }}>CERTIFICATE OF COMPLETION</h1>
              <p style={{ fontSize: '30px', marginBottom: '40px' }}>This is to certify that</p>
              <h2 style={{ fontSize: '50px', fontWeight: 'bold', color: '#eab308', marginBottom: '40px' }}>{certData.user_name}</h2>
              <p style={{ fontSize: '30px', marginBottom: '40px' }}>has successfully completed the course</p>
              <h3 style={{ fontSize: '40px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '60px' }}>{certData.course_title}</h3>
              <p style={{ fontSize: '20px', color: '#94a3b8' }}>Awarded on: {certData.date}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Certificate;
