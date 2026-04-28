import { Injectable } from '@angular/core';
import { Product, Category, Brand } from '../models/product.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  readonly categories: Category[] = [
    { id: 1, name: 'Laptop', icon: 'laptop', productCount: 20 },
    { id: 2, name: 'PC & Máy tính bàn', icon: 'pc', productCount: 10 },
    { id: 3, name: 'Phụ kiện', icon: 'headphones', productCount: 8 },
    { id: 4, name: 'Màn hình', icon: 'monitor', productCount: 7 },
    { id: 5, name: 'Bàn phím & Chuột', icon: 'keyboard', productCount: 5 },
  ];

  readonly brands: Brand[] = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Asus' },
    { id: 3, name: 'Dell' },
    { id: 4, name: 'HP' },
    { id: 5, name: 'Lenovo' },
    { id: 6, name: 'MSI' },
    { id: 7, name: 'Acer' },
    { id: 8, name: 'LG' },
    { id: 9, name: 'Samsung' },
    { id: 10, name: 'Logitech' },
  ];

  readonly products: Product[] = [
    // === APPLE LAPTOPS ===
    {
      id: 1, name: 'MacBook Air M3', price: 27990000, originalPrice: 32990000,
      cpu: 'Apple M3 8-core', ram: '8GB Unified', screen: '13.6" Liquid Retina',
      operatingSystem: 'macOS Sonoma', batteryCapacity: '52.6Wh - 18 giờ',
      design: 'Vỏ nhôm nguyên khối, 1.24kg', warrantyInfo: '12 tháng Apple',
      description: 'MacBook Air M3 mang đến hiệu năng vượt trội với chip M3 mới nhất, màn hình Liquid Retina tuyệt đẹp và thời lượng pin cả ngày.',
      soldQuantity: 245, stockQuantity: 50, categoryId: 1, brandId: 1,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', rating: 4.8, reviewCount: 156
    },
    {
      id: 2, name: 'MacBook Pro 14" M3 Pro', price: 48990000, originalPrice: 52990000,
      cpu: 'Apple M3 Pro 12-core', ram: '18GB Unified', screen: '14.2" Liquid Retina XDR',
      operatingSystem: 'macOS Sonoma', batteryCapacity: '72.4Wh - 17 giờ',
      design: 'Vỏ nhôm, Space Black, 1.61kg', warrantyInfo: '12 tháng Apple',
      description: 'MacBook Pro 14 inch với chip M3 Pro cho hiệu năng chuyên nghiệp, màn hình XDR siêu sáng và hệ thống âm thanh 6 loa.',
      soldQuantity: 189, stockQuantity: 35, categoryId: 1, brandId: 1,
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600', rating: 4.9, reviewCount: 203
    },
    {
      id: 3, name: 'MacBook Pro 16" M3 Max', price: 89990000, originalPrice: 92990000,
      cpu: 'Apple M3 Max 16-core', ram: '36GB Unified', screen: '16.2" Liquid Retina XDR',
      operatingSystem: 'macOS Sonoma', batteryCapacity: '100Wh - 22 giờ',
      design: 'Vỏ nhôm, Space Black, 2.14kg', warrantyInfo: '12 tháng Apple',
      description: 'Cỗ máy mạnh mẽ nhất của Apple dành cho các chuyên gia sáng tạo nội dung, phát triển phần mềm và xử lý đồ họa nặng.',
      soldQuantity: 67, stockQuantity: 15, categoryId: 1, brandId: 1,
      image: 'https://images.unsplash.com/photo-1639249227523-78f291f8376b?w=600', rating: 4.9, reviewCount: 89
    },
    // === ASUS LAPTOPS ===
    {
      id: 4, name: 'ASUS ROG Strix G16', price: 35990000, originalPrice: 39990000,
      cpu: 'Intel Core i9-13980HX', ram: '16GB DDR5', screen: '16" QHD+ 240Hz',
      operatingSystem: 'Windows 11', batteryCapacity: '90Wh - 8 giờ',
      design: 'Eclipse Gray, RGB keyboard, 2.5kg', warrantyInfo: '24 tháng ASUS',
      description: 'Laptop gaming cao cấp với card RTX 4070, tần số quét 240Hz và hệ thống tản nhiệt tiên tiến cho trải nghiệm gaming đỉnh cao.',
      soldQuantity: 312, stockQuantity: 28, categoryId: 1, brandId: 2,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600', rating: 4.7, reviewCount: 278
    },
    {
      id: 5, name: 'ASUS ZenBook 14 OLED', price: 22990000, originalPrice: 26990000,
      cpu: 'Intel Core Ultra 7 155H', ram: '16GB LPDDR5x', screen: '14" 2.8K OLED 120Hz',
      operatingSystem: 'Windows 11', batteryCapacity: '75Wh - 15 giờ',
      design: 'Ponder Blue, 1.28kg siêu nhẹ', warrantyInfo: '24 tháng ASUS',
      description: 'Ultrabook cao cấp với màn hình OLED 2.8K sắc nét, chip Intel thế hệ mới và thiết kế siêu mỏng nhẹ chỉ 1.28kg.',
      soldQuantity: 198, stockQuantity: 42, categoryId: 1, brandId: 2,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', rating: 4.6, reviewCount: 167
    },
    {
      id: 6, name: 'ASUS TUF Gaming A15', price: 19990000, originalPrice: 22990000,
      cpu: 'AMD Ryzen 7 7735HS', ram: '16GB DDR5', screen: '15.6" FHD 144Hz',
      operatingSystem: 'Windows 11', batteryCapacity: '76Wh - 10 giờ',
      design: 'Graphite Black, MIL-STD-810H, 2.2kg', warrantyInfo: '24 tháng ASUS',
      description: 'Laptop gaming bền bỉ đạt chuẩn quân sự, trang bị RTX 4060 và tản nhiệt kép hiệu quả.',
      soldQuantity: 456, stockQuantity: 65, categoryId: 1, brandId: 2,
      image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600', rating: 4.5, reviewCount: 342
    },
    // === DELL LAPTOPS ===
    {
      id: 7, name: 'Dell XPS 15', price: 42990000, originalPrice: 46990000,
      cpu: 'Intel Core i7-13700H', ram: '32GB DDR5', screen: '15.6" 3.5K OLED',
      operatingSystem: 'Windows 11 Pro', batteryCapacity: '86Wh - 13 giờ',
      design: 'Platinum Silver, InfinityEdge, 1.86kg', warrantyInfo: '12 tháng Dell',
      description: 'Laptop cao cấp với màn hình InfinityEdge không viền, chip Intel thế hệ 13 và thiết kế sang trọng cho doanh nhân.',
      soldQuantity: 134, stockQuantity: 22, categoryId: 1, brandId: 3,
      image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', rating: 4.7, reviewCount: 145
    },
    {
      id: 8, name: 'Dell Inspiron 16', price: 16990000, originalPrice: 18990000,
      cpu: 'Intel Core i5-1340P', ram: '16GB DDR4', screen: '16" FHD+ WVA',
      operatingSystem: 'Windows 11', batteryCapacity: '54Wh - 9 giờ',
      design: 'Carbon Black, 1.87kg', warrantyInfo: '12 tháng Dell',
      description: 'Laptop văn phòng màn hình 16 inch rộng rãi, hiệu năng ổn định cho công việc hàng ngày và giải trí.',
      soldQuantity: 523, stockQuantity: 78, categoryId: 1, brandId: 3,
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600', rating: 4.3, reviewCount: 289
    },
    {
      id: 9, name: 'Dell Gaming G15', price: 24990000, originalPrice: 27990000,
      cpu: 'Intel Core i7-13650HX', ram: '16GB DDR5', screen: '15.6" FHD 165Hz',
      operatingSystem: 'Windows 11', batteryCapacity: '86Wh - 10 giờ',
      design: 'Dark Shadow, tản nhiệt kép, 2.65kg', warrantyInfo: '12 tháng Dell',
      description: 'Laptop gaming tầm trung mạnh mẽ với RTX 4060, màn hình 165Hz và tản nhiệt hiệu quả.',
      soldQuantity: 287, stockQuantity: 33, categoryId: 1, brandId: 3,
      image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=600', rating: 4.4, reviewCount: 198
    },
    // === HP LAPTOPS ===
    {
      id: 10, name: 'HP Spectre x360 14', price: 38990000, originalPrice: 42990000,
      cpu: 'Intel Core Ultra 7 155H', ram: '16GB LPDDR5x', screen: '14" 2.8K OLED Touch',
      operatingSystem: 'Windows 11', batteryCapacity: '68Wh - 15 giờ',
      design: 'Nightfall Black, xoay 360°, 1.4kg', warrantyInfo: '12 tháng HP',
      description: 'Laptop 2-in-1 cao cấp với màn hình OLED cảm ứng xoay 360 độ, bút stylus và thiết kế sang trọng.',
      soldQuantity: 156, stockQuantity: 25, categoryId: 1, brandId: 4,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600', rating: 4.6, reviewCount: 134
    },
    {
      id: 11, name: 'HP Victus 16', price: 18990000, originalPrice: 21990000,
      cpu: 'AMD Ryzen 5 7535HS', ram: '8GB DDR5', screen: '16.1" FHD 144Hz',
      operatingSystem: 'Windows 11', batteryCapacity: '70Wh - 8 giờ',
      design: 'Mica Silver, 2.3kg', warrantyInfo: '12 tháng HP',
      description: 'Laptop gaming giá rẻ với RTX 4050, phù hợp cho sinh viên và game thủ tầm trung.',
      soldQuantity: 678, stockQuantity: 90, categoryId: 1, brandId: 4,
      image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600', rating: 4.2, reviewCount: 456
    },
    {
      id: 12, name: 'HP EliteBook 840 G10', price: 32990000, originalPrice: 35990000,
      cpu: 'Intel Core i7-1365U', ram: '16GB DDR5', screen: '14" WUXGA IPS',
      operatingSystem: 'Windows 11 Pro', batteryCapacity: '51Wh - 14 giờ',
      design: 'Silver, vỏ nhôm, 1.36kg', warrantyInfo: '36 tháng HP',
      description: 'Laptop doanh nghiệp cao cấp với bảo mật HP Wolf Security, chip vPro và bền bỉ chuẩn MIL-STD.',
      soldQuantity: 89, stockQuantity: 18, categoryId: 1, brandId: 4,
      image: 'https://images.unsplash.com/photo-1517059224940-d4af9eee5598?w=600', rating: 4.5, reviewCount: 78
    },
    // === LENOVO LAPTOPS ===
    {
      id: 13, name: 'Lenovo ThinkPad X1 Carbon Gen 11', price: 41990000, originalPrice: 45990000,
      cpu: 'Intel Core i7-1365U vPro', ram: '16GB LPDDR5', screen: '14" 2.8K OLED',
      operatingSystem: 'Windows 11 Pro', batteryCapacity: '57Wh - 15 giờ',
      design: 'Deep Black, 1.12kg siêu nhẹ', warrantyInfo: '36 tháng Lenovo',
      description: 'Laptop doanh nhân hàng đầu thế giới, siêu nhẹ 1.12kg, bàn phím tốt nhất trong phân khúc.',
      soldQuantity: 167, stockQuantity: 20, categoryId: 1, brandId: 5,
      image: 'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?w=600', rating: 4.8, reviewCount: 189
    },
    {
      id: 14, name: 'Lenovo Legion Pro 5', price: 39990000, originalPrice: 43990000,
      cpu: 'AMD Ryzen 9 7945HX', ram: '32GB DDR5', screen: '16" WQXGA 240Hz',
      operatingSystem: 'Windows 11', batteryCapacity: '99.99Wh - 9 giờ',
      design: 'Onyx Grey, tản nhiệt ColdFront, 2.5kg', warrantyInfo: '24 tháng Lenovo',
      description: 'Laptop gaming hiệu năng cao với RTX 4070, màn hình 240Hz và pin gần 100Wh cho gaming dài.',
      soldQuantity: 234, stockQuantity: 27, categoryId: 1, brandId: 5,
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600', rating: 4.7, reviewCount: 267
    },
    {
      id: 15, name: 'Lenovo IdeaPad Slim 5', price: 14990000, originalPrice: 17490000,
      cpu: 'AMD Ryzen 5 7530U', ram: '16GB DDR4', screen: '14" FHD IPS',
      operatingSystem: 'Windows 11', batteryCapacity: '56.5Wh - 12 giờ',
      design: 'Cloud Grey, 1.46kg', warrantyInfo: '24 tháng Lenovo',
      description: 'Laptop sinh viên giá tốt với hiệu năng ổn định, pin trâu và thiết kế gọn nhẹ.',
      soldQuantity: 892, stockQuantity: 120, categoryId: 1, brandId: 5,
      image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600', rating: 4.3, reviewCount: 567
    },
    // === MSI LAPTOPS ===
    {
      id: 16, name: 'MSI Raider GE78 HX', price: 72990000, originalPrice: 79990000,
      cpu: 'Intel Core i9-14900HX', ram: '32GB DDR5', screen: '17" UHD+ 144Hz Mini LED',
      operatingSystem: 'Windows 11', batteryCapacity: '99.99Wh - 7 giờ',
      design: 'Titanium Blue, Per-Key RGB, 3.1kg', warrantyInfo: '24 tháng MSI',
      description: 'Siêu laptop gaming với RTX 4080, màn hình Mini LED 4K và hệ thống tản nhiệt Phase Change Liquid Metal.',
      soldQuantity: 45, stockQuantity: 8, categoryId: 1, brandId: 6,
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600', rating: 4.8, reviewCount: 56
    },
    {
      id: 17, name: 'MSI Modern 15', price: 12990000, originalPrice: 15490000,
      cpu: 'Intel Core i5-1335U', ram: '8GB DDR4', screen: '15.6" FHD IPS',
      operatingSystem: 'Windows 11', batteryCapacity: '39.3Wh - 7 giờ',
      design: 'Urban Silver, 1.7kg', warrantyInfo: '24 tháng MSI',
      description: 'Laptop văn phòng mỏng nhẹ, phù hợp cho công việc hàng ngày với mức giá phải chăng.',
      soldQuantity: 345, stockQuantity: 55, categoryId: 1, brandId: 6,
      image: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=600', rating: 4.1, reviewCount: 234
    },
    {
      id: 18, name: 'MSI Stealth 16 Studio', price: 52990000, originalPrice: 57990000,
      cpu: 'Intel Core i7-13700H', ram: '32GB DDR5', screen: '16" QHD+ 240Hz OLED',
      operatingSystem: 'Windows 11 Pro', batteryCapacity: '82Wh - 9 giờ',
      design: 'Star Blue, CNC nhôm, 1.88kg', warrantyInfo: '24 tháng MSI',
      description: 'Laptop sáng tạo nội dung với RTX 4070, màn hình OLED 240Hz và thiết kế mỏng chỉ 19.95mm.',
      soldQuantity: 78, stockQuantity: 12, categoryId: 1, brandId: 6,
      image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=600', rating: 4.6, reviewCount: 93
    },
    // === ACER LAPTOPS ===
    {
      id: 19, name: 'Acer Predator Helios 16', price: 44990000, originalPrice: 49990000,
      cpu: 'Intel Core i9-13900HX', ram: '32GB DDR5', screen: '16" WQXGA 240Hz',
      operatingSystem: 'Windows 11', batteryCapacity: '90Wh - 8 giờ',
      design: 'Abyssal Black, 3D AeroBlade Fan, 2.6kg', warrantyInfo: '24 tháng Acer',
      description: 'Laptop gaming flagship với RTX 4080, tản nhiệt 3D AeroBlade và bàn phím MagForce từ tính.',
      soldQuantity: 112, stockQuantity: 15, categoryId: 1, brandId: 7,
      image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', rating: 4.6, reviewCount: 123
    },
    {
      id: 20, name: 'Acer Swift Go 14', price: 18990000, originalPrice: 21490000,
      cpu: 'Intel Core Ultra 5 125H', ram: '16GB LPDDR5x', screen: '14" 2.8K OLED',
      operatingSystem: 'Windows 11', batteryCapacity: '65Wh - 13 giờ',
      design: 'Moonstone White, 1.3kg', warrantyInfo: '12 tháng Acer',
      description: 'Ultrabook nhẹ chỉ 1.3kg với màn hình OLED 2.8K và chip Intel AI thế hệ mới.',
      soldQuantity: 267, stockQuantity: 38, categoryId: 1, brandId: 7,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600', rating: 4.4, reviewCount: 178
    },
    // === PC & MÁY TÍNH BÀN ===
    {
      id: 21, name: 'PC Gaming RTX 4070 Super', price: 28990000, originalPrice: 32990000,
      cpu: 'Intel Core i5-14600K', ram: '32GB DDR5 5600MHz', screen: 'Không kèm màn hình',
      operatingSystem: 'Windows 11', batteryCapacity: 'PSU 750W 80+ Gold',
      design: 'Case NZXT H5 Flow, RGB', warrantyInfo: '24 tháng linh kiện',
      description: 'Bộ PC Gaming cao cấp với RTX 4070 Super, SSD 1TB NVMe và tản nhiệt AIO 240mm.',
      soldQuantity: 189, stockQuantity: 20, categoryId: 2, brandId: 2,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600', rating: 4.7, reviewCount: 134
    },
    {
      id: 22, name: 'PC Văn phòng Core i3', price: 8990000, originalPrice: 10490000,
      cpu: 'Intel Core i3-12100', ram: '8GB DDR4 3200MHz', screen: 'Không kèm màn hình',
      operatingSystem: 'Windows 11', batteryCapacity: 'PSU 450W 80+',
      design: 'Case Compact mATX, gọn gàng', warrantyInfo: '24 tháng linh kiện',
      description: 'Bộ PC văn phòng giá rẻ, đủ mạnh cho Word, Excel và duyệt web hàng ngày.',
      soldQuantity: 567, stockQuantity: 45, categoryId: 2, brandId: 3,
      image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600', rating: 4.2, reviewCount: 312
    },
    {
      id: 23, name: 'Apple iMac 24" M3', price: 35990000, originalPrice: 38990000,
      cpu: 'Apple M3 8-core', ram: '8GB Unified', screen: '24" 4.5K Retina',
      operatingSystem: 'macOS Sonoma', batteryCapacity: 'Nguồn tích hợp',
      design: 'Midnight, thiết kế all-in-one 11.5mm', warrantyInfo: '12 tháng Apple',
      description: 'iMac M3 với màn hình 4.5K Retina 24 inch, thiết kế all-in-one siêu mỏng và hệ thống âm thanh 6 loa.',
      soldQuantity: 145, stockQuantity: 18, categoryId: 2, brandId: 1,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600', rating: 4.8, reviewCount: 167
    },
    {
      id: 24, name: 'PC Gaming RTX 4060', price: 18990000, originalPrice: 21990000,
      cpu: 'AMD Ryzen 5 5600', ram: '16GB DDR4 3200MHz', screen: 'Không kèm màn hình',
      operatingSystem: 'Windows 11', batteryCapacity: 'PSU 650W 80+ Bronze',
      design: 'Case MSI MAG Forge, ARGB', warrantyInfo: '24 tháng linh kiện',
      description: 'PC Gaming tầm trung với RTX 4060 8GB, chạy mượt mọi game ở 1080p.',
      soldQuantity: 334, stockQuantity: 32, categoryId: 2, brandId: 6,
      image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600', rating: 4.5, reviewCount: 245
    },
    {
      id: 25, name: 'PC Workstation Xeon', price: 45990000, originalPrice: 49990000,
      cpu: 'Intel Xeon W-1390P', ram: '64GB DDR5 ECC', screen: 'Không kèm màn hình',
      operatingSystem: 'Windows 11 Pro', batteryCapacity: 'PSU 850W 80+ Titanium',
      design: 'Case Fractal Design Meshify, tĩnh lặng', warrantyInfo: '36 tháng',
      description: 'Máy trạm chuyên nghiệp cho dựng phim, render 3D với Quadro RTX A4000 và RAM ECC.',
      soldQuantity: 34, stockQuantity: 5, categoryId: 2, brandId: 4,
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600', rating: 4.7, reviewCount: 28
    },
    // === PHỤ KIỆN ===
    {
      id: 26, name: 'AirPods Pro 2 USB-C', price: 5990000, originalPrice: 6790000,
      cpu: 'Chip H2', ram: 'N/A', screen: 'N/A',
      operatingSystem: 'iOS/macOS/Android', batteryCapacity: '6 giờ (30 giờ với case)',
      design: 'In-ear, chống ồn chủ động', warrantyInfo: '12 tháng Apple',
      description: 'Tai nghe true wireless cao cấp với ANC thế hệ 2, âm thanh không gian và cổng USB-C tiện lợi.',
      soldQuantity: 1234, stockQuantity: 200, categoryId: 3, brandId: 1,
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600', rating: 4.7, reviewCount: 890
    },
    {
      id: 27, name: 'Balo laptop ASUS ROG Ranger', price: 2490000, originalPrice: 2990000,
      cpu: 'N/A', ram: 'N/A', screen: 'N/A',
      operatingSystem: 'N/A', batteryCapacity: 'N/A',
      design: 'Polyester chống nước, ngăn laptop 17"', warrantyInfo: '12 tháng ASUS',
      description: 'Balo gaming chống nước với ngăn laptop 17 inch, nhiều ngăn phụ và đệm lưng thoáng khí.',
      soldQuantity: 567, stockQuantity: 80, categoryId: 3, brandId: 2,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', rating: 4.4, reviewCount: 345
    },
    {
      id: 28, name: 'Sạc dự phòng Anker 20000mAh', price: 890000, originalPrice: 1190000,
      cpu: 'N/A', ram: 'N/A', screen: 'Màn hình LED',
      operatingSystem: 'N/A', batteryCapacity: '20000mAh, PD 65W',
      design: 'Compact, mặt nhám chống trơn', warrantyInfo: '18 tháng Anker',
      description: 'Sạc dự phòng 20000mAh sạc nhanh PD 65W, đủ sạc laptop qua USB-C.',
      soldQuantity: 2345, stockQuantity: 300, categoryId: 3, brandId: 7,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600', rating: 4.6, reviewCount: 1567
    },
    {
      id: 29, name: 'Webcam Logitech C920 HD Pro', price: 1890000, originalPrice: 2290000,
      cpu: 'N/A', ram: 'N/A', screen: 'N/A',
      operatingSystem: 'Windows/Mac/Chrome OS', batteryCapacity: 'Nguồn USB',
      design: 'Full HD 1080p, 2 mic stereo', warrantyInfo: '24 tháng Logitech',
      description: 'Webcam Full HD 1080p cho họp online và streaming, 2 mic stereo khử ồn.',
      soldQuantity: 678, stockQuantity: 95, categoryId: 3, brandId: 10,
      image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70e0?w=600', rating: 4.5, reviewCount: 432
    },
    {
      id: 30, name: 'Hub USB-C 7in1 Ugreen', price: 690000, originalPrice: 890000,
      cpu: 'N/A', ram: 'N/A', screen: 'N/A',
      operatingSystem: 'Mọi hệ điều hành', batteryCapacity: 'Nguồn USB-C PD 100W pass-through',
      design: 'Nhôm CNC, compact 10x3cm', warrantyInfo: '18 tháng',
      description: 'Hub USB-C 7 cổng: HDMI 4K, USB 3.0 x3, SD/TF, PD 100W cho laptop.',
      soldQuantity: 1456, stockQuantity: 250, categoryId: 3, brandId: 7,
      image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600', rating: 4.3, reviewCount: 876
    },
    // === MÀN HÌNH ===
    {
      id: 31, name: 'LG UltraGear 27GP850-B', price: 9990000, originalPrice: 12490000,
      cpu: 'N/A', ram: 'N/A', screen: '27" QHD Nano IPS 165Hz',
      operatingSystem: 'N/A', batteryCapacity: 'Nguồn AC',
      design: 'Chân đế ergonomic, HDMI 2.1', warrantyInfo: '36 tháng LG',
      description: 'Màn hình gaming 27 inch QHD IPS 165Hz, 1ms, HDR400 và NVIDIA G-Sync Compatible.',
      soldQuantity: 345, stockQuantity: 40, categoryId: 4, brandId: 8,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600', rating: 4.7, reviewCount: 267
    },
    {
      id: 32, name: 'Samsung Odyssey G5 32"', price: 7490000, originalPrice: 8990000,
      cpu: 'N/A', ram: 'N/A', screen: '32" QHD VA 165Hz Curved',
      operatingSystem: 'N/A', batteryCapacity: 'Nguồn AC',
      design: 'Cong 1000R, FreeSync Premium', warrantyInfo: '24 tháng Samsung',
      description: 'Màn hình cong gaming 32 inch QHD 165Hz, độ cong 1000R immersive.',
      soldQuantity: 234, stockQuantity: 30, categoryId: 4, brandId: 9,
      image: 'https://images.unsplash.com/photo-1616763355548-1b67abf370f0?w=600', rating: 4.5, reviewCount: 189
    },
    {
      id: 33, name: 'Dell UltraSharp U2723QE', price: 12990000, originalPrice: 14990000,
      cpu: 'N/A', ram: 'N/A', screen: '27" 4K IPS Black',
      operatingSystem: 'N/A', batteryCapacity: 'Nguồn AC',
      design: 'USB-C 90W, KVM, IPS Black Tech', warrantyInfo: '36 tháng Dell',
      description: 'Màn hình chuyên nghiệp 4K IPS Black với USB-C 90W, tỷ lệ tương phản 2000:1 và 98% DCI-P3.',
      soldQuantity: 123, stockQuantity: 15, categoryId: 4, brandId: 3,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', rating: 4.8, reviewCount: 145
    },
    {
      id: 34, name: 'ASUS ProArt PA278QV', price: 8490000, originalPrice: 9990000,
      cpu: 'N/A', ram: 'N/A', screen: '27" QHD IPS 75Hz',
      operatingSystem: 'N/A', batteryCapacity: 'Nguồn AC',
      design: 'Xoay, nghiêng, nâng hạ, 100% sRGB', warrantyInfo: '36 tháng ASUS',
      description: 'Màn hình thiết kế đồ họa 27 inch với 100% sRGB, đã hiệu chỉnh màu từ nhà máy.',
      soldQuantity: 189, stockQuantity: 22, categoryId: 4, brandId: 2,
      image: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600', rating: 4.6, reviewCount: 156
    },
    // === BÀN PHÍM & CHUỘT ===
    {
      id: 35, name: 'Logitech MX Keys S', price: 2690000, originalPrice: 3190000,
      cpu: 'N/A', ram: 'N/A', screen: 'Đèn nền thông minh',
      operatingSystem: 'Windows/Mac/Linux', batteryCapacity: 'Pin sạc, 10 ngày',
      design: 'Low-profile, phím Perfect Stroke', warrantyInfo: '24 tháng Logitech',
      description: 'Bàn phím wireless cao cấp với phím Perfect Stroke, đèn nền tự động và kết nối 3 thiết bị.',
      soldQuantity: 456, stockQuantity: 60, categoryId: 5, brandId: 10,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', rating: 4.7, reviewCount: 345
    },
    {
      id: 36, name: 'Logitech MX Master 3S', price: 2490000, originalPrice: 2890000,
      cpu: 'N/A', ram: 'N/A', screen: 'N/A',
      operatingSystem: 'Windows/Mac/Linux', batteryCapacity: 'Pin sạc USB-C, 70 ngày',
      design: 'Ergonomic, 8000 DPI, MagSpeed', warrantyInfo: '24 tháng Logitech',
      description: 'Chuột wireless cao cấp nhất với cuộn MagSpeed, cảm biến 8000 DPI và click yên lặng.',
      soldQuantity: 567, stockQuantity: 75, categoryId: 5, brandId: 10,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', rating: 4.8, reviewCount: 423
    },
    {
      id: 37, name: 'ASUS ROG Azoth', price: 5490000, originalPrice: 5990000,
      cpu: 'N/A', ram: 'N/A', screen: 'Màn hình OLED trên bàn phím',
      operatingSystem: 'Windows', batteryCapacity: 'Pin 4000mAh, 2000 giờ',
      design: '75%, Gasket-mount, hot-swap, NX Snow', warrantyInfo: '24 tháng ASUS',
      description: 'Bàn phím cơ gaming wireless 75% với màn hình OLED, gasket-mount và switch hot-swap.',
      soldQuantity: 234, stockQuantity: 28, categoryId: 5, brandId: 2,
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', rating: 4.7, reviewCount: 189
    },
    {
      id: 38, name: 'Razer DeathAdder V3', price: 1890000, originalPrice: 2290000,
      cpu: 'N/A', ram: 'N/A', screen: 'N/A',
      operatingSystem: 'Windows', batteryCapacity: 'Có dây USB',
      design: 'Ergonomic, 30000 DPI, 59g siêu nhẹ', warrantyInfo: '24 tháng',
      description: 'Chuột gaming ergonomic siêu nhẹ 59g với cảm biến Focus Pro 30K DPI.',
      soldQuantity: 789, stockQuantity: 100, categoryId: 5, brandId: 7,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600', rating: 4.6, reviewCount: 534
    },
    // === THÊM SẢN PHẨM ===
    {
      id: 39, name: 'Lenovo Yoga 9i', price: 36990000, originalPrice: 41990000,
      cpu: 'Intel Core i7-1360P', ram: '16GB LPDDR5', screen: '14" 4K OLED Touch',
      operatingSystem: 'Windows 11', batteryCapacity: '75Wh - 14 giờ',
      design: 'Xoay 360°, Bowers & Wilkins, 1.4kg', warrantyInfo: '24 tháng Lenovo',
      description: 'Laptop 2-in-1 cao cấp với màn hình 4K OLED, loa Bowers & Wilkins và bút stylus.',
      soldQuantity: 123, stockQuantity: 16, categoryId: 1, brandId: 5,
      image: 'https://images.unsplash.com/photo-1544099858-75feeb57f01b?w=600', rating: 4.6, reviewCount: 98
    },
    {
      id: 40, name: 'Acer Nitro V 15', price: 16990000, originalPrice: 19990000,
      cpu: 'Intel Core i5-13420H', ram: '16GB DDR5', screen: '15.6" FHD 144Hz',
      operatingSystem: 'Windows 11', batteryCapacity: '57Wh - 7 giờ',
      design: 'Obsidian Black, 2.1kg', warrantyInfo: '12 tháng Acer',
      description: 'Laptop gaming giá rẻ nhất phân khúc RTX 4050 với hiệu năng tốt cho sinh viên.',
      soldQuantity: 789, stockQuantity: 95, categoryId: 1, brandId: 7,
      image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', rating: 4.3, reviewCount: 456
    },
    {
      id: 41, name: 'LG Gram 16', price: 29990000, originalPrice: 33990000,
      cpu: 'Intel Core i7-1360P', ram: '16GB LPDDR5', screen: '16" WQXGA IPS',
      operatingSystem: 'Windows 11', batteryCapacity: '80Wh - 22 giờ',
      design: 'White, siêu nhẹ 1.19kg', warrantyInfo: '12 tháng LG',
      description: 'Laptop siêu nhẹ nhất 16 inch chỉ 1.19kg với pin 80Wh dùng cả ngày.',
      soldQuantity: 156, stockQuantity: 19, categoryId: 1, brandId: 8,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', rating: 4.5, reviewCount: 123
    },
    {
      id: 42, name: 'Samsung Galaxy Book4 Pro', price: 31990000, originalPrice: 35990000,
      cpu: 'Intel Core Ultra 7 155H', ram: '16GB LPDDR5x', screen: '16" 3K AMOLED 120Hz',
      operatingSystem: 'Windows 11', batteryCapacity: '76Wh - 18 giờ',
      design: 'Moonstone Gray, 1.56kg', warrantyInfo: '12 tháng Samsung',
      description: 'Laptop AMOLED 3K 120Hz từ Samsung với chip Intel AI và thiết kế siêu mỏng.',
      soldQuantity: 98, stockQuantity: 14, categoryId: 1, brandId: 9,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', rating: 4.5, reviewCount: 87
    },
    {
      id: 43, name: 'LG UltraFine 32UN880-B', price: 15990000, originalPrice: 18990000,
      cpu: 'N/A', ram: 'N/A', screen: '32" 4K UHD IPS',
      operatingSystem: 'N/A', batteryCapacity: 'Nguồn AC',
      design: 'Arm Ergo, USB-C, HDR10', warrantyInfo: '36 tháng LG',
      description: 'Màn hình 4K với chân đế Ergo kẹp bàn, USB-C 60W và HDR10 cho thiết kế đồ họa.',
      soldQuantity: 89, stockQuantity: 12, categoryId: 4, brandId: 8,
      image: 'https://images.unsplash.com/photo-1616763355548-1b67abf370f0?w=600', rating: 4.6, reviewCount: 78
    },
    {
      id: 44, name: 'Tai nghe Sony WH-1000XM5', price: 7490000, originalPrice: 8490000,
      cpu: 'N/A', ram: 'N/A', screen: 'N/A',
      operatingSystem: 'iOS/Android', batteryCapacity: '30 giờ',
      design: 'Over-ear, ANC cao cấp, 250g', warrantyInfo: '12 tháng Sony',
      description: 'Tai nghe chống ồn tốt nhất thế giới với 30 giờ pin, âm thanh Hi-Res và 8 mic ANC.',
      soldQuantity: 678, stockQuantity: 85, categoryId: 3, brandId: 9,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600', rating: 4.8, reviewCount: 567
    },
    {
      id: 45, name: 'Bàn phím Apple Magic Keyboard', price: 3490000, originalPrice: 3990000,
      cpu: 'N/A', ram: 'N/A', screen: 'N/A',
      operatingSystem: 'macOS/iPadOS', batteryCapacity: 'Pin sạc Lightning, 1 tháng',
      design: 'Nhôm, Touch ID, Full-size', warrantyInfo: '12 tháng Apple',
      description: 'Bàn phím không dây Apple với Touch ID, bàn phím số và kết nối Bluetooth.',
      soldQuantity: 345, stockQuantity: 50, categoryId: 5, brandId: 1,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', rating: 4.5, reviewCount: 234
    },
    {
      id: 46, name: 'PC Mini Intel NUC 13 Pro', price: 14990000, originalPrice: 17490000,
      cpu: 'Intel Core i7-1365U', ram: '16GB DDR4', screen: 'Không kèm màn hình',
      operatingSystem: 'Windows 11 Pro', batteryCapacity: 'Nguồn 120W adapter',
      design: 'Mini PC 11.7x11.2x5.4cm', warrantyInfo: '24 tháng Intel',
      description: 'Mini PC siêu nhỏ gọn cho văn phòng, hỗ trợ 4 màn hình và Thunderbolt 4.',
      soldQuantity: 234, stockQuantity: 28, categoryId: 2, brandId: 3,
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600', rating: 4.4, reviewCount: 156
    },
    {
      id: 47, name: 'Màn hình Samsung ViewFinity S8', price: 10990000, originalPrice: 13490000,
      cpu: 'N/A', ram: 'N/A', screen: '27" 4K UHD IPS',
      operatingSystem: 'N/A', batteryCapacity: 'Nguồn AC',
      design: 'USB-C 90W, KVM, Matte Display', warrantyInfo: '36 tháng Samsung',
      description: 'Màn hình 4K chuyên nghiệp với USB-C 90W, HDR và 98% DCI-P3 cho sáng tạo nội dung.',
      soldQuantity: 167, stockQuantity: 20, categoryId: 4, brandId: 9,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', rating: 4.6, reviewCount: 134
    },
    {
      id: 48, name: 'Ổ cứng SSD Samsung 990 Pro 2TB', price: 4890000, originalPrice: 5690000,
      cpu: 'N/A', ram: 'N/A', screen: 'N/A',
      operatingSystem: 'Mọi hệ điều hành', batteryCapacity: 'N/A',
      design: 'M.2 NVMe PCIe 4.0, 7450MB/s', warrantyInfo: '60 tháng Samsung',
      description: 'SSD NVMe nhanh nhất với tốc độ đọc 7450MB/s, bảo hành 5 năm.',
      soldQuantity: 1234, stockQuantity: 180, categoryId: 3, brandId: 9,
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600', rating: 4.9, reviewCount: 890
    },
    {
      id: 49, name: 'Apple Magic Mouse', price: 2290000, originalPrice: 2590000,
      cpu: 'N/A', ram: 'N/A', screen: 'N/A',
      operatingSystem: 'macOS', batteryCapacity: 'Pin sạc Lightning, 1 tháng',
      design: 'Multi-touch, 99g, mặt kính', warrantyInfo: '12 tháng Apple',
      description: 'Chuột không dây Apple với bề mặt Multi-Touch, thiết kế tối giản và pin dùng 1 tháng.',
      soldQuantity: 456, stockQuantity: 65, categoryId: 5, brandId: 1,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', rating: 4.2, reviewCount: 345
    },
    {
      id: 50, name: 'Dell Alienware AW3225QF', price: 28990000, originalPrice: 32990000,
      cpu: 'N/A', ram: 'N/A', screen: '32" 4K QD-OLED 240Hz',
      operatingSystem: 'N/A', batteryCapacity: 'Nguồn AC',
      design: 'QD-OLED, HDMI 2.1, DP 2.1', warrantyInfo: '36 tháng Dell',
      description: 'Màn hình gaming đỉnh cao QD-OLED 4K 240Hz với 0.03ms và True Black 400.',
      soldQuantity: 56, stockQuantity: 7, categoryId: 4, brandId: 3,
      image: 'https://images.unsplash.com/photo-1616763355548-1b67abf370f0?w=600', rating: 4.9, reviewCount: 45
    },
  ];

  readonly mockUsers: User[] = [
    { id: 1, fullName: 'Admin User', email: 'admin@estore.com', phone: '0901234567', address: 'Hà Nội', roles: [{ id: 1, name: 'ROLE_ADMIN' }] },
    { id: 2, fullName: 'Nguyễn Văn Nhân Viên', email: 'staff@estore.com', phone: '0902345678', address: 'TP.HCM', roles: [{ id: 2, name: 'ROLE_STAFF' }] },
    { id: 3, fullName: 'Trần Thị Khách', email: 'customer@estore.com', phone: '0903456789', address: '123 Nguyễn Huệ, Q.1, TP.HCM', roles: [{ id: 3, name: 'ROLE_CUSTOMER' }] },
    { id: 4, fullName: 'Lê Văn Ship', email: 'shipper@estore.com', phone: '0904567890', address: 'Đà Nẵng', roles: [{ id: 4, name: 'ROLE_SHIPPER' }] },
  ];

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getProductsByCategory(categoryId: number): Product[] {
    return this.products.filter(p => p.categoryId === categoryId);
  }

  getProductsByBrand(brandId: number): Product[] {
    return this.products.filter(p => p.brandId === brandId);
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  getBrandById(id: number): Brand | undefined {
    return this.brands.find(b => b.id === id);
  }

  searchProducts(query: string): Product[] {
    const lower = query.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.cpu.toLowerCase().includes(lower)
    );
  }

  getFeaturedProducts(): Product[] {
    return [...this.products].sort((a, b) => b.soldQuantity - a.soldQuantity).slice(0, 8);
  }

  getNewProducts(): Product[] {
    return [...this.products].sort((a, b) => b.id - a.id).slice(0, 8);
  }

  getDiscountedProducts(): Product[] {
    return this.products
      .filter(p => p.originalPrice && p.originalPrice > p.price)
      .sort((a, b) => {
        const discountA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
        const discountB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
        return discountB - discountA;
      })
      .slice(0, 8);
  }
}
