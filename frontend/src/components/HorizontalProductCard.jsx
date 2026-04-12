import { ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const HorizontalProductCard = ({ product }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }
    
    try {
      await axios.post('http://localhost:5001/api/cart', {
        productId: product._id,
        quantity: 1
      });
      alert('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ", error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  return (
    <div className="card" style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
      <Link to={`/product/${product._id}`} style={{ flexShrink: 0, width: '160px', display: 'block' }}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              height: '160px', 
              objectFit: 'cover', 
              borderRadius: 'var(--radius-sm)'
            }} 
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '160px', 
            backgroundColor: 'var(--color-parchment)', 
            borderRadius: 'var(--radius-sm)'
          }}></div>
        )}
      </Link>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Giả lập badge hoặc tag danh mục nếu cần, dùng màu trang nhã */}
        <div style={{ marginBottom: 'var(--spacing-1)' }}>
           <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-lavender)', backgroundColor: 'var(--color-mysteria)', padding: '2px 8px', borderRadius: '4px' }}>
             Siêu phẩm
           </span>
        </div>
        
        <Link to={`/product/${product._id}`}>
          <h3 className="text-card-heading" style={{ marginBottom: 'var(--spacing-1)', color: 'var(--color-charcoal)' }}>
            {product.name}
          </h3>
        </Link>
        
        <p className="text-body" style={{ opacity: 0.7, marginBottom: 'var(--spacing-3)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div>
            <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: '1.25rem', display: 'block', color: 'var(--color-charcoal)' }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </span>
          </div>
          <button className="btn-primary" onClick={handleAddToCart} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: 'var(--spacing-2) var(--spacing-3)' }}>
            <ShoppingBag size={16} /> Thêm giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalProductCard;
