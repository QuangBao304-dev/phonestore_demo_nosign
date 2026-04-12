import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight, BookOpen, MessageCircle } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/blogs');
        setBlogs(res.data);
      } catch (error) {
        console.error("Error fetching blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return (
    <div className="container" style={{ padding: 'var(--spacing-8) 0', textAlign: 'center' }}>
       <p className="text-body" style={{ opacity: 0.6 }}>Đang nạp các tin tức công nghệ mới nhất...</p>
    </div>
  );

  const featuredBlog = blogs[0];
  const regularBlogs = blogs.slice(1);

  return (
    <div style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh', paddingBottom: 'var(--spacing-8)' }}>
      
      {/* Search/Banner Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e1e2f 0%, #121212 100%)', 
        padding: 'var(--spacing-8) 0', 
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 className="text-display-hero" style={{ fontSize: '3.5rem', marginBottom: 'var(--spacing-2)', color: 'white', letterSpacing: '-2px' }}>Tech Hub.</h1>
          <p style={{ opacity: 0.8, fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>Đánh giá chuyên sâu, mẹo vặt hữu ích và những tin tức mới nhất về thế giới Smartphone.</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-40px' }}>
        {/* Featured Blog Card */}
        {featuredBlog && (
          <Link 
            to={`/blogs/${featuredBlog.slug}`} 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)', 
              backgroundColor: 'var(--color-white)', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
              textDecoration: 'none',
              color: 'inherit',
              marginBottom: 'var(--spacing-8)'
            }}
          >
            <div style={{ height: '400px', overflow: 'hidden' }}>
               <img src={featuredBlog.thumbnail} alt={featuredBlog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
               <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--spacing-3)' }}>
                  {featuredBlog.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-mysteria)', backgroundColor: 'var(--color-lavender)', padding: '4px 10px', borderRadius: '20px' }}>{tag}</span>
                  ))}
               </div>
               <h2 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.1, marginBottom: 'var(--spacing-4)', letterSpacing: '-1px' }}>{featuredBlog.title}</h2>
               <p style={{ opacity: 0.7, fontSize: '1.1rem', marginBottom: 'var(--spacing-5)', lineHeight: 1.5 }}>{featuredBlog.summary}</p>
               <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '20px', opacity: 0.6, fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {featuredBlog.readingTime} </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> {featuredBlog.author}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageCircle size={16} /> {featuredBlog.comments?.length || 0} bình luận</span>
               </div>
            </div>
          </Link>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--spacing-6)' }}>
           {regularBlogs.map(blog => (
             <Link 
              key={blog._id} 
              to={`/blogs/${blog.slug}`} 
              className="card" 
              style={{ overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column', border: '1px solid var(--color-parchment)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
             >
                <div style={{ height: '220px' }}>
                   <img src={blog.thumbnail} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 'var(--spacing-5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-mysteria)', textTransform: 'uppercase', letterSpacing: '1px' }}>{blog.tags[0]}</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{new Date(blog.createdAt).toLocaleDateString()}</span>
                   </div>
                   <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', lineHeight: 1.3 }}>{blog.title}</h3>
                   <p style={{ opacity: 0.6, fontSize: '0.95rem', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{blog.summary}</p>
                   <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                         Đọc ngay <ArrowRight size={14} />
                      </span>
                      <span style={{ fontSize: '0.8rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '4px' }}>
                         <Clock size={14} /> {blog.readingTime}
                      </span>
                   </div>
                </div>
             </Link>
           ))}
        </div>

        {/* Newsletter Section */}
        <div style={{ marginTop: 'var(--spacing-8)', backgroundColor: 'var(--color-cream)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-7)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'var(--color-mysteria)', padding: '12px', borderRadius: '50%', marginBottom: 'var(--spacing-4)', color: 'white' }}>
             <BookOpen size={32} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Tham gia bản tin công nghệ</h2>
          <p style={{ opacity: 0.7, maxWidth: '500px', marginBottom: 'var(--spacing-5)' }}>Đăng ký để nhận những đánh giá sản phẩm và mẹo vặt Smartphone mới nhất trực tiếp vào hộp thư của bạn.</p>
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '500px' }}>
             <input 
              type="text" 
              placeholder="Email của bạn..." 
              style={{ flex: 1, padding: '14px 20px', borderRadius: '30px', border: '1px solid var(--color-parchment)', outline: 'none' }} 
             />
             <button className="btn-dark" style={{ padding: '14px 30px', borderRadius: '30px' }}>Đăng ký ngay</button>
          </div>
          <p style={{ fontSize: '0.8rem', opacity: 0.4, marginTop: '16px' }}>Chúng tôi tôn trọng sự riêng tư của bạn. Không spam, bảo đảm 100%.</p>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
