import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    if (user) {
      try {
        const res = await axios.get('http://localhost:5001/api/cart');
        setCart(res.data || { items: [] });
      } catch (error) {
        console.error("Error fetching cart", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    
    // Fetch some recommended products
    const fetchRecommended = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/products');
        setRecommendedProducts(res.data.slice(0, 4));
      } catch (e) {
        console.error(e);
      }
    };
    fetchRecommended();
  }, [user]);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await axios.post('http://localhost:5001/api/coupons/validate', { code: couponCode });
      const coupon = res.data;
      setCouponMessage(`Áp dụng thành công mã giảm ${coupon.discountPercent ? coupon.discountPercent + '%' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.discountAmount)}!`);
      
      const total = cart.items?.reduce((acc, item) => acc + (item.quantity * (item.product?.price || 0)), 0) || 0;
      if (coupon.discountPercent) {
        setDiscount(total * (coupon.discountPercent / 100));
      } else if (coupon.discountAmount) {
        setDiscount(coupon.discountAmount);
      }
    } catch (error) {
       setCouponMessage(error.response?.data?.message || 'Mã không hợp lệ hoặc đã hết hạn');
       setDiscount(0);
    }
  };

  const handleUpdateQuantity = async (productId, delta) => {
    try {
      await axios.post('http://localhost:5001/api/cart/add', { productId, quantity: delta });
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = async (productId) => {
    try {
      // Giả sử backend có route xóa toàn bộ item, nếu không ta dùng add với âm quantity
      // Ở đây ta dùng logic đơn giản là add số âm tương ứng quantity hiện tại
      const item = cart.items.find(i => i.product._id === productId);
      if (item) {
        await axios.post('http://localhost:5001/api/cart/add', { productId, quantity: -item.quantity });
        fetchCart();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const subtotal = cart.items?.reduce((acc, item) => acc + (item.quantity * (item.product?.price || 0)), 0) || 0;
  const shippingFee = subtotal > 10000000 ? 0 : 50000; // Free ship over 10M
  const total = Math.max(0, subtotal + shippingFee - discount);

  if (loading) return (
    <div className="container" style={{ padding: 'var(--spacing-8) 20px', textAlign: 'center' }}>
      <div className="loading-spinner"></div>
      <p style={{ marginTop: '16px', opacity: 0.6 }}>Đang chuẩn bị giỏ hàng của bạn...</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#fcfcfd', minHeight: '100vh', paddingBottom: 'var(--spacing-8)' }}>
      {/* Step Progress Wrapper */}
      <div style={{ backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-parchment)', padding: '20px 0', marginBottom: 'var(--spacing-6)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-mysteria)', fontWeight: 600 }}>
             <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-mysteria)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>1</span>
             Giỏ hàng
          </div>
          <ChevronRight size={16} style={{ opacity: 0.3 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.4 }}>
             <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-parchment)', color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</span>
             Thanh toán
          </div>
          <ChevronRight size={16} style={{ opacity: 0.3 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.4 }}>
             <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-parchment)', color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>3</span>
             Hoàn tất
          </div>
        </div>
      </div>

      <div className="container">
        {!user ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8) 0', maxWidth: '600px', margin: '0 auto' }}>
            <ShoppingCart size={64} color="var(--color-lavender)" style={{ marginBottom: '20px' }} />
            <h2 className="text-display-hero" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>Chưa đăng nhập</h2>
            <p className="text-body" style={{ marginBottom: 'var(--spacing-6)', opacity: 0.7 }}>Vui lòng đăng nhập để lưu giữ các siêu phẩm công nghệ bạn yêu thích.</p>
            <Link to="/login" className="btn-primary" style={{ padding: '14px 40px' }}>Đăng nhập ngay</Link>
          </div>
        ) : cart.items && cart.items.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--spacing-6)', alignItems: 'start' }}>
            
            {/* LEFT COLUMN: PRODUCT LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                 <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Giỏ hàng ({cart.items.length})</h2>
                 <Link to="/products" className="text-amethyst-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                    <ArrowLeft size={14} /> Tiếp tục mua sắm
                 </Link>
              </div>

              {cart.items.map((item) => (
                <div key={item._id} className="card" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '24px', 
                  padding: '20px', 
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-lavender)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                   <div style={{ width: '120px', height: '120px', backgroundColor: '#f9f9fb', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                      {item.product?.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <ShoppingCart size={32} opacity={0.1} />
                        </div>
                      )}
                   </div>

                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>{item.product?.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.4 }}>Phân loại: flagship • Bảo hành 12 tháng</p>
                      
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-parchment)', borderRadius: '20px', padding: '4px' }}>
                            <button 
                              onClick={() => handleUpdateQuantity(item.product._id, -1)}
                              disabled={item.quantity <= 1}
                              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', display: 'flex', opacity: item.quantity <= 1 ? 0.2 : 1 }}
                            >
                               <Minus size={16} />
                            </button>
                            <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.product._id, 1)}
                              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', display: 'flex' }}
                            >
                               <Plus size={16} />
                            </button>
                         </div>
                         <button 
                          onClick={() => handleRemove(item.product._id)}
                          style={{ border: 'none', background: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', cursor: 'pointer', opacity: 0.7 }}
                         >
                            <Trash2 size={14} /> Xóa
                         </button>
                      </div>
                   </div>

                   <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--color-charcoal)' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product?.price * item.quantity)}
                      </p>
                      <p style={{ fontSize: '0.85rem', opacity: 0.5 }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product?.price)} / máy
                      </p>
                   </div>
                </div>
              ))}
              
              {/* RECOMMENDED SECTION */}
              <div style={{ marginTop: 'var(--spacing-8)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--spacing-5)' }}>Có thể bạn quan tâm</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                  {recommendedProducts.map(p => (
                    <Link key={p._id} to="/products" className="card" style={{ padding: '16px', textDecoration: 'none', color: 'inherit' }}>
                      <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '120px', objectFit: 'contain', marginBottom: '12px' }} />
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, height: '2.4rem', overflow: 'hidden' }}>{p.name}</h4>
                      <p style={{ color: 'var(--color-mysteria)', fontWeight: 700, marginTop: '8px' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div className="card" style={{ padding: '24px', border: '1px solid var(--color-parchment)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--color-parchment)', paddingBottom: '12px' }}>Tóm tắt đơn hàng</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.6 }}>Tạm tính ({cart.items.length} sp)</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.6 }}>Phí vận chuyển</span>
                    <span>{shippingFee === 0 ? <span style={{ color: '#16a34a', fontWeight: 600 }}>Miễn phí</span> : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                      <span>Giảm giá</span>
                      <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)}</span>
                    </div>
                  )}
                </div>

                {/* Coupon Input */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Mã giảm giá</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Nhập mã..." 
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-parchment)', flex: 1, outline: 'none', fontSize: '0.9rem' }}
                    />
                    <button onClick={applyCoupon} className="btn-dark" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>Áp dụng</button>
                  </div>
                  {couponMessage && <p style={{ fontSize: '0.8rem', marginTop: '8px', color: discount > 0 ? '#16a34a' : '#ef4444' }}>{couponMessage}</p>}
                </div>

                <div style={{ borderTop: '2px dashed var(--color-parchment)', paddingTop: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Tổng cộng</span>
                    <span style={{ fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-mysteria)', letterSpacing: '-0.5px' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'right', marginTop: '4px' }}>(Đã bao gồm thuế VAT nếu có)</p>
                </div>

                <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 20px -5px rgba(118, 75, 162, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  Thanh toán ngay <CreditCard size={20} />
                </button>

                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                      <div style={{ color: 'var(--color-mysteria)' }}><Truck size={18} /></div>
                      <span>Dự kiến giao hàng: <strong>2 - 3 ngày làm việc</strong></span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                      <div style={{ color: '#16a34a' }}><ShieldCheck size={18} /></div>
                      <span>Thanh toán an toàn & bảo mật 100%</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8) 0', maxWidth: '600px', margin: '60px auto' }}>
            <div style={{ backgroundColor: 'var(--color-cream)', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
               <ShoppingCart size={48} color="var(--color-lavender)" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--spacing-3)' }}>Giỏ hàng trống</h2>
            <p className="text-body" style={{ marginBottom: 'var(--spacing-6)', opacity: 0.7 }}>Có vẻ như bạn chưa chọn được siêu phẩm nào ưng ý. Hãy khám phá thêm nhé!</p>
            <Link to="/products" className="btn-dark" style={{ padding: '14px 40px', borderRadius: '30px' }}>Khám phá sản phẩm ngay</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
