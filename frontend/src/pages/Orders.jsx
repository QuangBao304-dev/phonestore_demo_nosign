import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-8) 0', textAlign: 'center' }}>
        <h2 className="text-section-display">Lịch sử đơn hàng</h2>
        <p style={{ margin: 'var(--spacing-4) 0' }}>Vui lòng đăng nhập để xem các đơn hàng của bạn.</p>
        <Link to="/login" className="btn-primary">Đăng nhập ngay</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh', padding: 'var(--spacing-6) 0' }}>
      <div className="container">
         <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <h1 className="text-section-display">Lịch sử Đơn hàng.</h1>
            <p style={{ opacity: 0.7, marginTop: 'var(--spacing-2)' }}>Kiểm tra tình trạng các thiết bị cao cấp mà bạn đã đặt mua.</p>
         </div>

         {loading ? (
           <p className="text-body">Đang tải lịch sử...</p>
         ) : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
             {orders.length === 0 ? (
               <p>Bạn chưa có đơn đặt hàng nào.</p>
             ) : (
               orders.map(order => (
                 <div key={order._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-parchment)', paddingBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ backgroundColor: 'var(--color-parchment)', padding: '10px', borderRadius: '8px' }}>
                          <Package size={20} color="var(--color-charcoal)" />
                        </div>
                        <div>
                          <span style={{ display: 'block', fontWeight: 'bold', fontSize: '1.1rem' }}>Đơn hàng #{order._id.substring(order._id.length - 8)}</span>
                          <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Đặt ngày: {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', padding: '4px 12px', borderRadius: '20px', backgroundColor: order.status === 'Pending' ? '#fef3c7' : '#dcfce7', color: order.status === 'Pending' ? '#d97706' : '#16a34a', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {order.status === 'Pending' ? 'Đang xử lý' : 'Đã xác nhận'}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '8px 0' }}>
                      <p style={{ fontWeight: 600, marginBottom: '8px' }}>Sản phẩm:</p>
                      <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {order.items.map((item, idx) => (
                          <li key={idx} style={{ opacity: 0.8 }}>
                            {item.product?.name || 'Sản phẩm không xác định'} <span style={{ fontWeight: 600 }}>x{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-parchment)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                       <span style={{ fontSize: '1.2rem' }}>Tổng cộng: <strong style={{ color: 'var(--color-charcoal)' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</strong></span>
                    </div>
                 </div>
               ))
             )}
           </div>
         )}
      </div>
    </div>
  );
};

export default Orders;
