import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Clock, 
  User, 
  ArrowLeft, 
  MessageCircle, 
  Send, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/blogs/${slug}`);
      setBlog(res.data);
    } catch (error) {
      console.error("Error fetching blog detail", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    
    const fetchSidebar = async () => {
      try {
        const prodRes = await axios.get('http://localhost:5001/api/products');
        setRelatedProducts(prodRes.data.slice(0, 3));
      } catch (e) { console.error(e); }
    };
    fetchSidebar();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    try {
      await axios.post(`http://localhost:5001/api/blogs/${slug}/comments`, { text: commentText });
      setCommentText('');
      fetchBlog();
    } catch (error) {
      console.error("Error submitting comment", error);
    }
  };

  if (loading) return (
    <div className="container" style={{ padding: 'var(--spacing-8) 0', textAlign: 'center' }}>
       <p className="text-body" style={{ opacity: 0.6 }}>Đang nạp bài viết...</p>
    </div>
  );

  if (!blog) return (
    <div className="container" style={{ padding: 'var(--spacing-8) 0', textAlign: 'center' }}>
       <h2 style={{ fontSize: '2rem' }}>Không tìm thấy bài viết.</h2>
       <Link to="/blogs" className="text-amethyst-link">Quay lại trang danh sách</Link>
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh', paddingBottom: 'var(--spacing-8)' }}>
      
      {/* Blog Hero Heading */}
      <div style={{ backgroundColor: '#f9f9fb', padding: 'var(--spacing-8) 0', borderBottom: '1px solid var(--color-parchment)' }}>
        <div className="container">
          <Link to="/blogs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-mysteria)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'var(--spacing-5)' }}>
             <ArrowLeft size={16} /> Quay lại Tech Hub
          </Link>
          <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--spacing-3)' }}>
             {blog.tags.map(tag => (
                <span key={tag} style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-mysteria)', textTransform: 'uppercase', letterSpacing: '1px' }}>{tag}</span>
             ))}
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-charcoal)', lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 'var(--spacing-4)' }}>{blog.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', opacity: 0.6, fontSize: '0.95rem' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> {blog.readingTime} </span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> {blog.author}</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}> Xuất bản: {new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 'var(--spacing-7)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 4fr)', gap: 'var(--spacing-8)', alignItems: 'start' }}>
          
          {/* MAIN CONTENT AREA */}
          <article>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--spacing-7)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <img src={blog.thumbnail} alt={blog.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
            </div>

            {/* Content Body */}
            <div 
              style={{ 
                fontSize: '1.2rem', 
                lineHeight: 1.8, 
                color: 'var(--color-charcoal)', 
                opacity: 0.9,
                whiteSpace: 'pre-line' 
              }}
            >
              {blog.content}
            </div>

            <hr style={{ margin: 'var(--spacing-8) 0', border: 'none', borderTop: '1px solid var(--color-parchment)' }} />

            {/* Comments Section */}
            <section id="comments">
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 'var(--spacing-5)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MessageCircle size={24} /> Thảo luận ({blog.comments?.length || 0})
              </h3>

              {!user ? (
                <div style={{ backgroundColor: 'var(--color-cream)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)' }}>
                  <p style={{ opacity: 0.7 }}>Bạn cần <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-mysteria)', textDecoration: 'underline' }}>Đăng nhập</Link> để tham gia thảo luận cùng cộng đồng Phong Vũ.</p>
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} style={{ marginBottom: 'var(--spacing-7)' }}>
                  <div style={{ position: 'relative' }}>
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Chia sẻ ý kiến của bạn về bài viết này..."
                      style={{ 
                        width: '100%', 
                        padding: '16px', 
                        paddingRight: '60px',
                        borderRadius: 'var(--radius-md)', 
                        border: '2px solid var(--color-parchment)', 
                        minHeight: '100px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-lavender)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-parchment)'}
                    />
                    <button 
                      type="submit"
                      style={{ 
                        position: 'absolute', 
                        bottom: '16px', 
                        right: '16px', 
                        backgroundColor: 'var(--color-mysteria)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px', 
                        borderRadius: '50%', 
                        cursor: 'pointer',
                        display: 'flex'
                      }}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
                {blog.comments?.map(comment => (
                  <div key={comment._id} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' }}>
                     <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-charcoal)' }}>
                        {comment.username ? comment.username.charAt(0).toUpperCase() : 'U'}
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                           <strong style={{ fontSize: '1rem' }}>{comment.username}</strong>
                           <span style={{ fontSize: '0.8rem', opacity: 0.4 }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p style={{ opacity: 0.8, lineHeight: 1.5 }}>{comment.text}</p>
                     </div>
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* SIDEBAR */}
          <aside style={{ position: 'sticky', top: '100px' }}>
             {/* Related Products Card */}
             <div className="card" style={{ padding: '24px', backgroundColor: '#fcfcfd', border: '1px solid var(--color-parchment)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                   <TrendingUp size={18} color="var(--color-mysteria)" /> Siêu phẩm gợi ý
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {relatedProducts.map(p => (
                     <Link key={p._id} to="/products" style={{ display: 'flex', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', border: '1px solid #eee' }}>
                           <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                           <h5 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</h5>
                           <p style={{ color: 'var(--color-mysteria)', fontWeight: 700, fontSize: '0.85rem' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</p>
                        </div>
                     </Link>
                   ))}
                </div>
                <Link to="/products" className="btn-dark" style={{ width: '100%', marginTop: '24px', padding: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                   Xem tất cả <ChevronRight size={16} />
                </Link>
             </div>

             {/* Ad / Newsletter Small */}
             <div style={{ marginTop: 'var(--spacing-6)', padding: '24px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--color-mysteria) 0%, #2a284d 100%)', color: 'white' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>Đừng bỏ lỡ tin tức!</h4>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '20px' }}>Nhận thông báo bài viết mới nhất ngay khi chúng tôi xuất bản.</p>
                <button style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-lavender)', color: 'var(--color-mysteria)', fontWeight: 700, cursor: 'pointer' }}>Đăng ký ngay</button>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
