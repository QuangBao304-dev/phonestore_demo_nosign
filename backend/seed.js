import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import Coupon from './src/models/Coupon.js';
import Blog from './src/models/Blog.js';

dotenv.config();

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_CONNECTIONSTRING || 'mongodb+srv://quangyeuhang3278_db_user:ncvKudWsMDX2jYw1@cluster0.sti4gp5.mongodb.net/dev?appName=Cluster0';
    await mongoose.connect(uri);
    console.log("Connected to MongoDB via seed script.");

    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await Blog.deleteMany();
    console.log("Cleared existing categories, products, coupons, blogs.");

    // MẢNG DANH MỤC CÁC HÃNG ĐIỆN THOẠI
    const categoriesData = [
      { name: "iPhone (Apple)", description: "Các dòng điện thoại iPhone đẳng cấp nhất từ Apple." },
      { name: "Samsung", description: "Điện thoại Samsung Galaxy với công nghệ màn hình đỉnh cao." },
      { name: "Xiaomi", description: "Cấu hình mạnh mẽ, giá thành hợp lý từ gã khổng lồ Trung Quốc." },
      { name: "OPPO", description: "Chuyên gia selfie, thiết kế thời trang và sạc siêu nhanh." },
      { name: "Vivo", description: "Đột phá về camera và âm thanh Hi-Fi di động." },
      { name: "Google (Pixel)", description: "Trải nghiệm Android thuần khiết với camera AI thông minh." },
      { name: "Realme", description: "Thương hiệu trẻ trung, hiệu năng vượt trội trong tầm giá." },
    ];

    const insertedCategories = await Category.insertMany(categoriesData);
    
    // Ánh xạ ID các hãng
    const getCatId = (name) => insertedCategories.find(c => c.name === name)._id;

    const appleId = getCatId("iPhone (Apple)");
    const samsungId = getCatId("Samsung");
    const xiaomiId = getCatId("Xiaomi");
    const oppoId = getCatId("OPPO");
    const vivoId = getCatId("Vivo");
    const googleId = getCatId("Google (Pixel)");
    const realmeId = getCatId("Realme");

    // MẢNG SẢN PHẨM ĐIỆN THOẠI
    const seedProducts = [
      { name: "iPhone 15 Pro Max 256GB", category: appleId, description: "Khung titanium siêu nhẹ, chip A17 Pro mạnh mẽ vượt trội với Ray Tracing phần cứng. Camera zoom quang học 5x.", price: 34990000, stockQuantity: 50, imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop" },
      { name: "iPhone 15 Pro 128GB", category: appleId, description: "Thiết kế nhỏ gọn mạnh mẽ, khung viền Titan và nút Action mới linh hoạt.", price: 28990000, stockQuantity: 30, imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop" },
      { name: "iPhone 14 128GB", category: appleId, description: "Hiệu năng ổn định với chip A15 Bionic, thời lượng pin ấn tượng và camera cải tiến.", price: 18490000, stockQuantity: 100, imageUrl: "https://images.unsplash.com/photo-1663465373087-6fa3e82d8c36?q=80&w=800&auto=format&fit=crop" },
      { name: "Samsung Galaxy S24 Ultra", category: samsungId, description: "Quyền năng Galaxy AI. Khung viền Titanium bền bỉ, bút S-Pen tích hợp và camera 200MP.", price: 33990000, stockQuantity: 40, imageUrl: "https://images.unsplash.com/photo-1707028126868-fe0e8e6ab8d0?q=80&w=800&auto=format&fit=crop" },
      { name: "Samsung Galaxy Z Fold5", category: samsungId, description: "Màn hình gập đỉnh cao, biến smartphone thành máy tính bảng mini cho công việc đa nhiệm.", price: 30990000, stockQuantity: 15, imageUrl: "https://images.unsplash.com/photo-1691437142416-833334255cf0?q=80&w=800&auto=format&fit=crop" },
      { name: "Xiaomi 14 Pro 5G", category: xiaomiId, description: "Sức mạnh bộc phá từ Snapdragon 8 Gen 3. Cụm ống kính quang học Leica danh tiếng.", price: 21990000, stockQuantity: 60, imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop" },
      { name: "OPPO Find X7 Ultra", category: oppoId, description: "Hệ thống camera kép tiềm vọng đầu tiên trên thế giới, hợp tác cùng Hasselblad.", price: 25990000, stockQuantity: 10, imageUrl: "https://images.unsplash.com/photo-1636413233814-11910ef707a3?q=80&w=800&auto=format&fit=crop" },
      { name: "Google Pixel 8 Pro", category: googleId, description: "Quyền năng AI đỉnh cao, phần mềm mượt mà nhất giới Android cùng camera chụp tối vô đối.", price: 23990000, stockQuantity: 20, imageUrl: "https://images.unsplash.com/photo-1709403429314-4113ceaaec53?q=80&w=800&auto=format&fit=crop" },
    ];

    await Product.insertMany(seedProducts);

    // MẢNG BLOGS TIN TỨC
    const seedBlogs = [
      {
        title: "Đánh giá chi tiết iPhone 15 Pro Max sau 6 tháng sử dụng",
        slug: "danh-gia-iphone-15-pro-max",
        summary: "Liệu khung viền Titan và chip A17 Pro có thực sự tạo nên sự khác biệt sau thời gian dài trải nghiệm?",
        content: `Cùng chúng tôi đi sâu vào chi tiết những điểm mạnh và điểm yếu của siêu phẩm iPhone 15 Pro Max. Từ khả năng chiến game đồ họa nặng với Ray Tracing cho đến khả năng nhiếp ảnh từ ống kính tiềm vọng 5x mới. 

Mọi người thường nói về sức mạnh của A17 Pro, nhưng sự thoải mái khi cầm nắm nhờ khung Titan mới là thứ bạn cảm nhận rõ nhất mỗi ngày. Trong bài viết này, Admin Phong Vũ sẽ chia sẻ lại toàn bộ những gì bạn cần biết trước khi quyết định nâng cấp lên thế hệ mới này.`,
        thumbnail: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop",
        tags: ["iPhone", "Review", "Apple"],
        readingTime: "8 min"
      },
      {
        title: "Galaxy S24 Ultra và kỷ nguyên Galaxy AI",
        slug: "galaxy-s24-ultra-ai-era",
        summary: "Không chỉ là phần cứng mạnh mẽ, Samsung đang định nghĩa lại cách chúng ta dùng điện thoại thông qua trí tuệ nhân tạo.",
        content: `Galaxy AI trên S24 Ultra không chỉ là một cái tên tiếp thị. Nó thực sự thay đổi cách chúng ta dịch thuật, ghi chú và chỉnh sửa ảnh chuyên nghiệp nhanh chóng.

Ngoài AI, màn hình phẳng 2600 nits là một sự cải tiến vượt bậc về thị giác, giúp bạn quan sát rõ nét ngay cả dưới trời nắng gắt. Hãy cùng tìm hiểu 5 tính năng AI đỉnh nhất mà bạn nên dùng ngay trên chiếc flagship này.`,
        thumbnail: "https://images.unsplash.com/photo-1707028126868-fe0e8e6ab8d0?q=80&w=800&auto=format&fit=crop",
        tags: ["Samsung", "Galaxy AI", "S24 Ultra"],
        readingTime: "6 min"
      },
      {
        title: "Tại sao Google Pixel vẫn là ông vua nhiếp ảnh di động?",
        slug: "pixel-king-of-photography",
        summary: "Tìm hiểu bí mật đằng sau thuật toán xử lý hình ảnh của Google giúp Pixel 8 Pro dẫn đầu các bảng xếp hạng camera.",
        content: `Phần cứng không phải là tất cả. Google đã chứng minh qua nhiều năm rằng AI và ML (Machine Learning) mới là chìa khóa để tạo nên những bức ảnh thiếu sáng và chân dung chân thực nhất.

Bài viết này sẽ phân tích cách Pixel 8 Pro tối ưu hóa màu da, khử nhiễu và tính năng 'Best Take' gây tranh cãi nhưng cực kỳ hữu ích trong các kỳ nghỉ gia đình.`,
        thumbnail: "https://images.unsplash.com/photo-1709403429314-4113ceaaec53?q=80&w=800&auto=format&fit=crop",
        tags: ["Google", "Pixel 8 Pro", "Camera"],
        readingTime: "5 min"
      },
      {
        title: "5 Mẹo tối ưu hóa thời lượng Pin cho Smartphone của bạn",
        slug: "tips-optimize-battery-smartphone",
        summary: "Những thói quen đơn giản giúp kéo dài tuổi thọ Pin và thời gian sử dụng trong ngày cực hiệu quả.",
        content: `Pin luôn là vấn đề đau đầu nhất hiện nay. Dù bạn dùng iPhone hay Android, những quy tắc về sạc nhanh, quản lý ứng dụng chạy ngầm và độ sáng màn hình thích ứng vẫn luôn đúng.

Hãy cùng xem qua các thiết lập ẩn giúp bạn tiết kiệm đến 15% dung lượng pin mỗi ngày mà không làm giảm trải nghiệm sử dụng.`,
        thumbnail: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop",
        tags: ["Mẹo vặt", "Smartphone", "Pin"],
        readingTime: "4 min"
      }
    ];

    await Blog.insertMany(seedBlogs);

    // Create Coupons
    const seedCoupons = [
      { code: "MOBILE2026", discountPercent: 15, startDate: new Date(), endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), usageLimit: 1000 },
      { code: "IPHONEVIP", discountAmount: 1000000, startDate: new Date(), endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), usageLimit: 100 },
      { code: "SAMSUNDAY", discountPercent: 20, startDate: new Date(), endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), usageLimit: 200 }
    ];
    await Coupon.insertMany(seedCoupons);

    console.log(`Database seeded successfully with ${insertedCategories.length} Categories, ${seedProducts.length} Products, ${seedBlogs.length} Blogs and ${seedCoupons.length} Coupons.`);
    process.exit(0);
  } catch (error) {
    console.error("Error in seeding data:", error);
    process.exit(1);
  }
};

seedDB();
