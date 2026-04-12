import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Star, List, LayoutGrid, Cpu } from 'lucide-react';
import HorizontalProductCard from '../components/HorizontalProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get('http://localhost:5001/api/products'),
          axios.get('http://localhost:5001/api/categories')
        ]);
        
        // Lấy sản phẩm nổi bật
        setFeaturedProducts(prodRes.data.slice(0, 4));
        // Lấy danh mục
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error fetching homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Icon mock for categories list
  const getCategoryIcon = (index) => {
    const icons = [<Cpu size={18} key={1}/>, <LayoutGrid size={18} key={2}/>, <Star size={18} key={3}/>];
    return icons[index % icons.length];
  };

  return (
    <div style={{ backgroundColor: 'var(--color-white)' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px', position: 'relative', zIndex: 10 }}>
          <h1 className="text-display-hero" style={{ marginBottom: 'var(--spacing-4)' }}>
            Công nghệ siêu việt.<br/>Trải nghiệm <span className="text-lavender">đẳng cấp.</span>
          </h1>
          <p className="text-body" style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-6)', opacity: 0.8, maxWidth: '600px', margin: '0 auto var(--spacing-6)' }}>
            Khám phá trọn bộ thiết bị flagship mạnh mẽ nhất năm. Ngôn ngữ thiết kế tối giản, hiệu suất phần cứng tối đa. 
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'center' }}>
            <Link to="/products" className="btn-primary" style={{ padding: 'var(--spacing-3) var(--spacing-5)' }}>
              Bộ sưu tập cao cấp
            </Link>
          </div>
        </div>
      </section>

      {/* 2-Column App Layout Container */}
      <section style={{ padding: 'var(--spacing-6) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 3fr)', gap: 'var(--spacing-6)', alignItems: 'start' }}>
            
            {/* Cột trái: Sản phẩm nổi bật */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-4)' }}>
                <h2 className="text-section-display">Sản phẩm nổi bật</h2>
                <Link to="/products" className="text-amethyst-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'var(--font-weight-bold)' }}>
                  Xem tất cả <ArrowRight size={16} />
                </Link>
              </div>

              {loading ? (
                <div style={{ padding: 'var(--spacing-6) 0' }}>Đang tải bộ sưu tập nổi bật...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  {featuredProducts.map(product => (
                    <HorizontalProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>

            {/* Cột phải: Danh mục Sidebar */}
            <div>
              <div className="card" style={{ padding: 'var(--spacing-5)', position: 'sticky', top: '100px' }}>
                <h3 className="text-card-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-4)' }}>
                  <List size={22} color="var(--color-charcoal)" /> Danh mục
                </h3>
                
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {categories.map((cat, index) => (
                    <li key={cat._id} style={{ borderBottom: '1px solid var(--color-parchment)', padding: 'var(--spacing-3) 0' }}>
                      <Link to="/products" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-charcoal)', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: index % 2 === 0 ? 'var(--color-mysteria)' : 'var(--color-lavender)' }}></span>
                          {cat.name}
                        </div>
                        <span style={{ opacity: 0.5 }}>{getCategoryIcon(index)}</span>
                      </Link>
                    </li>
                  ))}
                  {/* Bản hiển thị tĩnh vài danh mục mock nếu ít danh mục trong DB */}
                  {categories.length < 5 && (
                    <>
                      <li style={{ borderBottom: '1px solid var(--color-parchment)', padding: 'var(--spacing-3) 0' }}>
                        <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-charcoal)', fontWeight: 500 }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-charcoal)' }}></span>
                          Phụ kiện cáp sạc
                        </Link>
                      </li>
                      <li style={{ borderBottom: '1px solid var(--color-parchment)', padding: 'var(--spacing-3) 0' }}>
                        <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-charcoal)', fontWeight: 500 }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-amethyst)' }}></span>
                          Âm thanh & Tai nghe
                        </Link>
                      </li>
                    </>
                  )}
                </ul>

                <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'center' }}>
                  <Link to="/categories" className="text-amethyst-link" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                    Xem tất cả danh mục &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
