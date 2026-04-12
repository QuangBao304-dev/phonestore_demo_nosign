import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Laptop, 
  Mouse, 
  Keyboard, 
  Monitor, 
  Smartphone, 
  Headphones, 
  Cpu, 
  Box,
  ArrowRight
} from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/categories');
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Map category names to icons
  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('laptop')) return <Laptop size={32} />;
    if (n.includes('chuột') || n.includes('mouse')) return <Mouse size={32} />;
    if (n.includes('phím') || n.includes('keyboard')) return <Keyboard size={32} />;
    if (n.includes('màn') || n.includes('monitor')) return <Monitor size={32} />;
    if (n.includes('điện thoại') || n.includes('phone')) return <Smartphone size={32} />;
    if (n.includes('tai nghe') || n.includes('headphone')) return <Headphones size={32} />;
    if (n.includes('linh kiện') || n.includes('component')) return <Cpu size={32} />;
    return <Box size={32} />;
  };

  // Predefined gradients for cards
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh', paddingTop: 0, paddingBottom: 'var(--spacing-8)' }}>
      
      {/* Page Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #2a284d 0%, var(--color-mysteria) 100%)', 
        padding: 'var(--spacing-8) 0', 
        marginBottom: 'var(--spacing-7)',
        color: 'white',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="container">
          <h1 className="text-display-hero" style={{ marginBottom: 'var(--spacing-2)', color: 'white', fontSize: '3rem', letterSpacing: '-1.5px', fontWeight: 700 }}>Danh mục thương hiệu</h1>
          <p className="text-body" style={{ opacity: 0.8, maxWidth: '600px', fontSize: '1.2rem' }}>
            Tìm kiếm theo hãng sản xuất để khám phá những nét đặc trưng riêng biệt của từng thương hiệu công nghệ.
          </p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8) 0' }}>
            <p className="text-body" style={{ opacity: 0.6 }}>Đang nạp các hạng mục tuyệt phẩm...</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 'var(--spacing-5)' 
          }}>
            {categories.map((cat, index) => (
              <Link 
                key={cat._id} 
                to={`/products?category=${cat._id}`}
                className="category-card"
                style={{ 
                  background: gradients[index % gradients.length],
                  padding: 'var(--spacing-5)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '220px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Decorative circle */}
                <div style={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  right: '-20px', 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  zIndex: 0
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ marginBottom: 'var(--spacing-3)', opacity: 0.9 }}>
                    {getIcon(cat.name)}
                  </div>
                  <h2 className="text-card-heading" style={{ fontSize: '1.75rem', fontWeight: 600, color: 'white', letterSpacing: '-0.5px' }}>
                    {cat.name}
                  </h2>
                  <p style={{ marginTop: 'var(--spacing-2)', opacity: 0.8, fontSize: '0.9rem', lineHeight: 1.4 }}>
                    {cat.description || `Xem ngay các thiết bị ${cat.name} cao cấp nhất hiện nay.`}
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontWeight: 600, 
                  fontSize: '0.9rem',
                  marginTop: 'var(--spacing-4)',
                  position: 'relative',
                  zIndex: 1
                }}>
                  Khám phá ngay <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Offers / Discount Section */}
      <div style={{ marginTop: 'var(--spacing-8)', backgroundColor: 'var(--color-cream)', padding: 'var(--spacing-8) 0' }}>
        <div className="container">
          <div style={{ 
            backgroundColor: 'var(--color-mysteria)', 
            borderRadius: 'var(--radius-lg)', 
            padding: 'var(--spacing-6)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--spacing-4)'
          }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>Ưu đãi đặc biệt hôm nay!</h3>
              <p style={{ opacity: 0.8 }}>Giảm giá tới 20% cho tất cả các thiết bị Linh kiện & Phụ kiện.</p>
            </div>
            <Link to="/coupons" className="btn-primary" style={{ backgroundColor: 'var(--color-lavender)', color: 'var(--color-mysteria)' }}>
              Lấy mã giảm giá
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
