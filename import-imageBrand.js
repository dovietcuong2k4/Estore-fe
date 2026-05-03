import mysql from 'mysql2/promise';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dlwf1izos',
  api_key: '477756124483842',
  api_secret: 'hQBSLb7R2euWcBvsx_juj6aKaSI'
});

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mydb'
});

// Lấy danh sách brands từ DB
const [brands] = await connection.execute(
  'SELECT id, name FROM brands'
);

for (const b of brands) {
  console.log(`🔍 Đang tìm ảnh cho brand: ${b.name}`);

  // 1. Tìm 1 ảnh
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(b.name + ' logo white background')}&per_page=1`,
    {
      headers: {
        Authorization: 'Client-ID vUfFNpSefdOKBvS_tkP0rAtStNsIxaa377dW5xR1c3E'
      }
    }
  );

  const data = await res.json();

  if (!data.results?.length) {
    console.log(`❌ Không có ảnh cho brand: ${b.name}`);
    continue;
  }

  const imageUrl = data.results[0]?.urls?.regular;
  if (!imageUrl) continue;

  try {
    // Upload lên Cloudinary
    const uploaded = await cloudinary.uploader.upload(imageUrl, {
      folder: 'brands'
    });

    // Update vào bảng brands
    await connection.execute(
      `UPDATE brands 
       SET image_url = ? 
       WHERE id = ?`,
      [uploaded.secure_url, b.id]
    );

    console.log(`✅ Hoàn tất: ${b.name}`);
  } catch (err) {
    console.error(`❌ Lỗi brand ${b.name}:`, err.message);
  }
}

await connection.end();
