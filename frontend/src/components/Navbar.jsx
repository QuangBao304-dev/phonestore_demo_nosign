import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Cpu, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/categories');
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories for navbar", error);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{ borderBottom: '1px solid var(--color-parchment)', padding: 'var(--spacing-3) 0', position: 'sticky', top: 0, backgroundColor: 'var(--color-translucent-95)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
      {/* Cần update container thành lưới linh hoạt hơn để chứa đủ thành phần */}
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-6)', maxWidth: '1400px' }}>
        
        {/* LOGO SECTION */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'var(--font-weight-bold)', fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
          <div style={{ backgroundColor: 'var(--color-lavender)', padding: '4px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={20} color="var(--color-mysteria)" />
          </div>
          Phong Vũ
        </Link>
        
        {/* NAVIGATION LINKS SECTION */}
        <nav style={{ display: 'flex', gap: 'var(--spacing-5)', alignItems: 'center' }}>
          <Link to="/" style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>Trang chủ</Link>
          <Link to="/products" style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>Sản phẩm</Link>
          
          {/* CATEGORY DROPDOWN */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button 
              style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 0' }}
              onClick={() => navigate('/categories')}
            >
              Danh mục <ChevronDown size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </button>
            
            {isDropdownOpen && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                backgroundColor: 'var(--color-white)', 
                border: '1px solid var(--color-parchment)', 
                borderRadius: 'var(--radius-sm)', 
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                minWidth: '220px',
                padding: '8px 0',
                zIndex: 1000,
                marginTop: '1px' // Gần như sát để không bị mất hover
              }}>
                <Link 
                  to="/products" 
                  style={{ display: 'block', padding: '10px 20px', fontSize: '0.9rem', hover: { backgroundColor: 'var(--color-cream)' } }}
                  className="dropdown-item"
                >
                  Tất cả sản phẩm
                </Link>
                {categories.map(cat => (
                  <Link 
                    key={cat._id} 
                    to={`/products?category=${cat._id}`} 
                    style={{ display: 'block', padding: '10px 20px', fontSize: '0.9rem' }}
                    className="dropdown-item"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/coupons" style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>Khuyến mãi</Link>
          <Link to="/blogs" style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>Blog</Link>
        </nav>

        {/* SEARCH BAR */}
        <div style={{ flex: 1, position: 'relative', maxWidth: '300px' }}>
          <Search size={16} color="var(--color-charcoal)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
          <input 
            type="text" 
            placeholder="Tìm siêu phẩm..." 
            style={{ 
              width: '100%', 
              padding: '10px 16px 10px 36px', 
              borderRadius: '20px', 
              border: '1px solid var(--color-parchment)',
              backgroundColor: 'var(--color-white)',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: '0.9rem'
            }} 
          />
        </div>
        
        {/* ACTION / AUTH SECTION */}
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
          {/* Cart Icon with Badge */}
          <Link to="/cart" style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: '4px' }}>
            <ShoppingBag size={22} color="var(--color-charcoal)" />
            {/* Giả lập badge số lượng giống bản mẫu (Màu sắc vẫn theo chuẩn cũ) */}
            <span style={{ 
              position: 'absolute', 
              top: '-2px', 
              right: '-6px', 
              backgroundColor: 'var(--color-charcoal)', 
              color: 'var(--color-white)', 
              fontSize: '0.65rem', 
              fontWeight: 'bold', 
              width: '18px', 
              height: '18px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '50%'
            }}>
              1
            </span>
          </Link>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-parchment)' }}></div>

          {user ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
               <Link to="/orders" style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>Lịch sử Đơn</Link>
               <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: '0.95rem' }}>Đăng xuất</button>
             </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
              <Link to="/login" style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>
                Đăng ký
              </Link>
              <Link to="/login" className="btn-primary" style={{ fontSize: '0.95rem' }}>
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
