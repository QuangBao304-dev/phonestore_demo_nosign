import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, LayoutGrid } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import HorizontalProductCard from '../components/HorizontalProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const categoryParam = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Only trigger search on button click

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get('http://localhost:5001/api/products'),
        axios.get('http://localhost:5001/api/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  // Filter logic with ultra-defensive checks to prevent White Screen crashes
  const filteredProducts = (products || []).filter(product => {
    if (!product) return false;

    // 1. Search filter first (cheaper)
    const name = product.name || '';
    const description = product.description || '';
    const searchLower = (searchQuery || '').toLowerCase();
    
    const matchSearch = name.toLowerCase().includes(searchLower) || 
                       description.toLowerCase().includes(searchLower);
    
    if (!matchSearch) return false;

    // 2. Category filter
    // If no category filter in URL, show the product
    if (!categoryParam) return true;

    // Get the category ID from the product defensively
    const prodCatId = product.category?._id ? String(product.category._id) : (product.category ? String(product.category) : null);
    
    // Check if ID matches directly
    if (prodCatId === String(categoryParam)) return true;

    // Fallback: Check if names match (helpful if IDs are desynced)
    const prodCatName = product.category?.name ? String(product.category.name).toLowerCase() : null;
    const targetCat = (categories || []).find(c => c && String(c._id) === String(categoryParam));
    const targetCatName = targetCat?.name ? String(targetCat.name).toLowerCase() : null;

    if (prodCatName && targetCatName && prodCatName === targetCatName) return true;
    
    return false;
  });

  return (
    <div style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh', paddingTop: 0, paddingBottom: 'var(--spacing-6)' }}>
      
      {/* Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--color-mysteria) 0%, #2a284d 100%)', 
        padding: 'var(--spacing-8) 0', 
        marginBottom: 'var(--spacing-6)',
        color: 'white',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="container">
          <h1 className="text-display-hero" style={{ fontSize: '3rem', marginBottom: 'var(--spacing-2)', color: 'white', letterSpacing: '-1.5px', fontWeight: 700 }}>Tất cả sản phẩm</h1>
          <p style={{ opacity: 0.8, fontSize: '1.2rem', fontWeight: 400, maxWidth: '600px' }}>Khám phá toàn bộ hệ sinh thái điện thoại thông minh cao cấp được tuyển lựa kỹ lưỡng.</p>
        </div>
      </div>

      <div className="container">
        
        {loading ? (
          <p className="text-body" style={{ textAlign: 'center', padding: 'var(--spacing-8) 0' }}>Đang nạp dữ liệu siêu phẩm...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 9fr)', gap: 'var(--spacing-6)', alignItems: 'start' }}>
            
            {/* CỘT TRÁI: SIDEBAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
              
              {/* Search Card */}
              <div className="card" style={{ padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-4)', fontWeight: 'bold' }}>
                  <Search size={20} color="var(--color-charcoal)" /> Tìm kiếm
                </h3>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <input 
                    type="text" 
                    placeholder="Tên sản phẩm, mô tả..." 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--color-parchment)', width: '100%', outline: 'none' }}
                  />
                  <button type="submit" className="btn-dark" style={{ width: '100%', padding: '10px' }}>Tìm</button>
                </form>
              </div>

              {/* Danh mục Card */}
              <div className="card" style={{ padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                   <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                     <LayoutGrid size={20} color="var(--color-charcoal)" /> Danh mục
                   </h3>
                </div>
                
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>
                    <button 
                      onClick={() => {
                        setSearchParams({});
                      }}
                      style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        padding: '12px 16px', 
                        borderRadius: '6px', 
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: !categoryParam ? 'bold' : 'normal',
                        backgroundColor: !categoryParam ? 'var(--color-cream)' : 'transparent',
                        color: !categoryParam ? 'var(--color-charcoal)' : 'inherit',
                        transition: 'all 0.2s'
                      }}
                    >
                      Tất cả
                    </button>
                  </li>
                  {categories.map((cat, index) => {
                    const isActive = categoryParam === String(cat._id);
                    const dotColor = index % 2 === 0 ? 'var(--color-mysteria)' : 'var(--color-lavender)';
                    
                    return (
                      <li key={cat._id}>
                        <button 
                          onClick={() => {
                            setSearchParams({ category: cat._id });
                          }}
                          style={{ 
                            width: '100%', 
                            textAlign: 'left', 
                            padding: '12px 16px', 
                            borderRadius: '6px', 
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontWeight: categoryParam === cat._id ? 'bold' : 'normal',
                            backgroundColor: categoryParam === cat._id ? 'var(--color-cream)' : 'transparent',
                            color: categoryParam === cat._id ? 'var(--color-charcoal)' : 'inherit',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor }}></span>
                          {cat.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* CỘT PHẢI: KHỐI SẢN PHẨM */}
            <div>
              {/* Thống kê Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-5)', borderBottom: '1px solid var(--color-parchment)', paddingBottom: 'var(--spacing-3)' }}>
                <p style={{ opacity: 0.8 }}>Tìm thấy <strong style={{ color: 'var(--color-charcoal)', fontSize: '1.1rem' }}>{filteredProducts.length}</strong> sản phẩm</p>
                
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, fontWeight: 500 }}>
                  <LayoutGrid size={18} /> Hiển thị dạng thẻ ngang
                </button>
              </div>

              {/* Product List */}
              {filteredProducts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8) 0' }}>
                  <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>Không có siêu phẩm nào khớp với tìm kiếm của bạn.</p>
                  <button onClick={() => { setSearchParams({}); setSearchQuery(''); setSearchInput(''); }} className="text-amethyst-link" style={{ marginTop: 'var(--spacing-3)', display: 'inline-block' }}>
                    Tải lại toàn bộ
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  {filteredProducts.map(product => (
                    <HorizontalProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
