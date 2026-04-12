import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag } from 'lucide-react';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/coupons');
        setCoupons(res.data);
      } catch (error) {
        console.error("Error fetching coupons", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh', paddingTop: 0, paddingBottom: 'var(--spacing-6)' }}>
      {/* Hero Banner Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
        padding: 'var(--spacing-8) 0', 
        marginBottom: 'var(--spacing-7)',
        color: 'white',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="container">
          <h1 className="text-display-hero" style={{ fontSize: '3rem', color: 'white', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 'var(--spacing-2)' }}>Săn Mã Ưu Đãi.</h1>
          <p style={{ opacity: 0.8, fontSize: '1.2rem', maxWidth: '600px' }}>Tiết kiệm tối đa khi mua sắm các thiết bị flagship với các ưu đãi độc quyền dành riêng cho bạn.</p>
        </div>
      </div>

      <div className="container">

         {loading ? (
           <p className="text-body">Đang tải mã giảm giá...</p>
         ) : (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-4)' }}>
             {coupons.length === 0 ? (
               <p>Hệ thống hiện chưa có mã giảm giá nào.</p>
             ) : (
               coupons.map(coupon => (
                 <div key={coupon._id} className="card" style={{ display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, var(--color-white) 0%, var(--color-parchment) 100%)', border: 'none' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--spacing-3)' }}>
                     <div style={{ backgroundColor: 'var(--color-mysteria)', padding: '12px', borderRadius: '50%' }}>
                        <Tag color="var(--color-lavender)" size={24} />
                     </div>
                     <div>
                       <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-charcoal)' }}>
                         MÃ: <span style={{ letterSpacing: '2px', backgroundColor: 'var(--color-white)', padding: '4px 8px', borderRadius: '4px', border: '1px dashed var(--color-lavender)' }}>{coupon.code}</span>
                       </h3>
                     </div>
                   </div>
                   <h4 className="text-card-heading" style={{ marginBottom: 'var(--spacing-2)' }}>
                     {coupon.discountAmount ? `Giảm trực tiếp ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.discountAmount)}` : `Giảm sâu ${coupon.discountPercent}% cho đơn hàng`}
                   </h4>
                   <p className="text-body" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                     Hạn dùng đến: <span style={{ fontWeight: 600 }}>{new Date(coupon.endDate).toLocaleDateString()}</span>
                   </p>
                 </div>
               ))
             )}
           </div>
         )}
      </div>
    </div>
  );
};

export default Coupons;
