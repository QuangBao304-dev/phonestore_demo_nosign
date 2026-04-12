import { ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
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
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <Link to={`/product/${product._id}`} style={{ display: 'block', color: 'inherit' }}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              height: '240px', 
              objectFit: 'cover', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: 'var(--spacing-4)' 
            }} 
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '240px', 
            backgroundColor: 'var(--color-parchment)', 
            borderRadius: 'var(--radius-sm)', 
            marginBottom: 'var(--spacing-4)' 
          }}></div>
        )}
        <h3 className="text-card-heading" style={{ marginBottom: 'var(--spacing-2)' }}>
          {product.name}
        </h3>
      </Link>
      <p className="text-body" style={{ opacity: 0.7, marginBottom: 'var(--spacing-4)', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-parchment)' }}>
        <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: '1.25rem' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
        </span>
        <button className="btn-dark" onClick={handleAddToCart} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: 'var(--spacing-2) var(--spacing-3)' }}>
          <ShoppingBag size={18} /> Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
