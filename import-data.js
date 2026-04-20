import mysql from 'mysql2/promise';

// Nhập dữ liệu mẫu
import { mockData } from './mock-data.js';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mydb'
};

async function main() {
  const connection = await mysql.createConnection(dbConfig);

  console.log('🚀 Bắt đầu nhập dữ liệu...');

  // =============================
  // 1. DANH MỤC
  // =============================
  for (const c of mockData.categories) {
    await connection.execute(
      `INSERT INTO categories (name)
       SELECT ? WHERE NOT EXISTS (
         SELECT 1 FROM categories WHERE name = ?
       )`,
      [c.name, c.name]
    );
  }

  // =============================
  // 2. HÃNG
  // =============================
  for (const b of mockData.brands) {
    await connection.execute(
      `INSERT INTO brands (name)
       SELECT ? WHERE NOT EXISTS (
         SELECT 1 FROM brands WHERE name = ?
       )`,
      [b.name, b.name]
    );
  }

  // =============================
  // 3. SẢN PHẨM
  // =============================
  for (const p of mockData.products) {
    // Ánh xạ danh mục + hãng theo tên
    const [catRows] = await connection.execute(
      `SELECT id FROM categories WHERE name = ? LIMIT 1`,
      [getCategoryName(p.categoryId)]
    );

    const [brandRows] = await connection.execute(
      `SELECT id FROM brands WHERE name = ? LIMIT 1`,
      [getBrandName(p.brandId)]
    );

    if (!catRows.length || !brandRows.length) {
      console.log(`⚠️ Bỏ qua sản phẩm: ${p.name}`);
      continue;
    }

    const categoryId = catRows[0].id;
    const brandId = brandRows[0].id;

    // Thêm sản phẩm
    await connection.execute(
      `INSERT INTO products (
        name, price, cpu, ram, screen,
        operating_system, battery_capacity,
        design, warranty_info, description,
        sold_quantity, stock_quantity,
        category_id, brand_id
      )
      SELECT ?,?,?,?,?,?,?,?,?,?,?,?, ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM products WHERE name = ?
      )`,
      [
        p.name,
        p.price,
        p.cpu,
        p.ram,
        p.screen,
        p.operatingSystem,
        p.batteryCapacity,
        p.design,
        p.warrantyInfo,
        p.description,
        p.soldQuantity,
        p.stockQuantity,
        categoryId,
        brandId,
        p.name
      ]
    );

    // Thêm ảnh
    if (p.image) {
      await connection.execute(
        `INSERT INTO product_images (product_id, image_url, is_thumbnail)
         SELECT id, ?, true FROM products
         WHERE name = ?
         AND NOT EXISTS (
           SELECT 1 FROM product_images pi
           JOIN products pr ON pi.product_id = pr.id
           WHERE pr.name = ?
         )`,
        [p.image, p.name, p.name]
      );
    }

    console.log(`✅ Đã nhập: ${p.name}`);
  }

  console.log('🎉 Hoàn tất nhập dữ liệu');
  await connection.end();
}

// =============================
// ÁNH XẠ
// =============================
function getCategoryName(id) {
  const map = {
    1: 'Laptop',
    2: 'PC & Máy tính bàn',
    3: 'Phụ kiện',
    4: 'Màn hình',
    5: 'Bàn phím & Chuột'
  };
  return map[id];
}

function getBrandName(id) {
  const map = {
    1: 'Apple',
    2: 'Asus',
    3: 'Dell',
    4: 'HP',
    5: 'Lenovo',
    6: 'MSI',
    7: 'Acer',
    8: 'LG',
    9: 'Samsung',
    10: 'Logitech'
  };
  return map[id];
}

main().catch(console.error);