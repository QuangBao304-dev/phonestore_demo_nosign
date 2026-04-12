import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, Star } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/products/${id}`),
          axios.get(`http://localhost:5001/api/reviews/product/${id}`)
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data);
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/reviews', 
        { productId: id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([res.data, ...reviews]);
      setComment('');
      alert('Đã gửi đánh giá thành công');
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  if (loading) return <div className="container" style={{ padding: 'var(--spacing-8) 0' }}>Đang tải siêu phẩm...</div>;
  if (!product) return <div className="container" style={{ padding: 'var(--spacing-8) 0' }}>Không tìm thấy sản phẩm.</div>;

  return (
    <div style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh', padding: 'var(--spacing-6) 0' }}>
      <div className="container">
        
        {/* Product Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-8)' }}>
          <div>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: 'var(--radius-md)', mixBlendMode: 'multiply' }} />
            ) : (
              <div style={{ width: '100%', height: '400px', backgroundColor: 'var(--color-parchment)', borderRadius: 'var(--radius-md)' }}></div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: 'var(--spacing-3)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-lavender)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {product.category?.name || 'Sản phẩm cao cấp'}
              </span>
            </div>
            <h1 className="text-display-hero" style={{ marginBottom: 'var(--spacing-4)', color: 'var(--color-charcoal)' }}>{product.name}</h1>
            <p className="text-body" style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: 'var(--spacing-5)' }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-5)', marginBottom: 'var(--spacing-6)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-charcoal)' }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </span>
              <button className="btn-primary" onClick={handleAddToCart} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '1.1rem' }}>
                <ShoppingBag size={20} /> Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ borderTop: '1px solid var(--color-parchment)', padding: 'var(--spacing-8) 0' }}>
          <h2 className="text-section-display" style={{ marginBottom: 'var(--spacing-5)' }}>Đánh giá từ cộng đồng</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: 'var(--spacing-6)' }}>
             {/* Submit Review Form */}
             <div className="card" style={{ padding: 'var(--spacing-5)', alignSelf: 'start' }}>
                <h3 className="text-card-heading" style={{ marginBottom: 'var(--spacing-4)' }}>Đóng góp ý kiến</h3>
                {!user ? (
                  <p style={{ opacity: 0.7 }}>Vui lòng <span style={{ cursor: 'pointer', color: 'var(--color-lavender)', fontWeight: 'bold' }} onClick={() => navigate('/login')}>đăng nhập</span> để đánh giá.</p>
                ) : (
                  <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                     <div>
                       <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Chấm điểm</label>
                       <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-parchment)', width: '100%', outline: 'none' }}>
                         <option value="5">5 Sao - Tuyệt vời</option>
                         <option value="4">4 Sao - Rất tốt</option>
                         <option value="3">3 Sao - Bình thường</option>
                         <option value="2">2 Sao - Tệ</option>
                         <option value="1">1 Sao - Rất tệ</option>
                       </select>
                     </div>
                     <div>
                       <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Bình luận</label>
                       <textarea 
                         value={comment} onChange={(e) => setComment(e.target.value)} 
                         placeholder="Chia sẻ trải nghiệm của bạn..." required
                         style={{ padding: '12px', borderRadius: '4px', border: '1px solid var(--color-parchment)', width: '100%', minHeight: '100px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                       />
                     </div>
                     <button type="submit" className="btn-dark">Gửi đánh giá</button>
                  </form>
                )}
             </div>

             {/* Review List */}
             <div>
               {reviews.length === 0 ? (
                 <p style={{ opacity: 0.6 }}>Chưa có đánh giá nào cho sản phẩm này.</p>
               ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                   {reviews.map(review => (
                     <div key={review._id} style={{ padding: 'var(--spacing-4)', border: '1px solid var(--color-parchment)', borderRadius: 'var(--radius-sm)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                         <span style={{ fontWeight: 'bold', color: 'var(--color-charcoal)' }}>{review.user?.fullName || review.user?.username || 'Ẩn danh'}</span>
                         <span style={{ color: 'var(--color-lavender)', display: 'flex', alignItems: 'center' }}>
                            {review.rating} <Star size={14} fill="currentColor" style={{ marginLeft: '4px' }} />
                         </span>
                       </div>
                       <p style={{ opacity: 0.8 }}>{review.comment}</p>
                       <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '8px' }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
