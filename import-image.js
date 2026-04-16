import mysql from 'mysql2/promise';
import { v2 as cloudinary } from 'cloudinary';
import { mockData } from './mock-data.js';

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

for (const p of mockData.products) {
  console.log(`🔍 Crawling: ${p.name}`);

  // 1. search ảnh
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(p.name)}&per_page=3`,
    {
      headers: {
        Authorization: 'Client-ID vUfFNpSefdOKBvS_tkP0rAtStNsIxaa377dW5xR1c3E'
      }
    }
  );

  const data = await res.json();

  console.log(data);

  if (!data.results.length) continue;

  // 🔥 lấy id thật từ DB
    const [rows] = await connection.execute(
    'SELECT id FROM products WHERE name = ?',
    [p.name]
    );

    if (!rows.length) {
    console.log(`❌ Không tìm thấy product: ${p.name}`);
    continue;
    }

    const productId = rows[0].id;

    let index = 0;

    for (const img of data.results.slice(0, 3)) {
    const imageUrl = img.urls.regular;

    if (!imageUrl) continue;

    // upload cloudinary
    const uploaded = await cloudinary.uploader.upload(imageUrl, {
        folder: 'products'
    });

    // insert DB (🔥 dùng productId thay vì p.id)
    await connection.execute(
        `INSERT INTO product_images (product_id, image_url, public_id, is_thumbnail, sort_order)
        VALUES (?, ?, ?, ?, ?)`,
        [
        productId,
        uploaded.secure_url,
        uploaded.public_id,
        index === 0,
        index
        ]
    );

    index++;
    }

    console.log(`✅ Done: ${p.name}`);
}


// const targetIds = [18,24,25,26,31,32,34,42,44,48,53,57];

// const [products] = await connection.execute(
//   `SELECT id, name FROM products WHERE id IN (${targetIds.map(() => '?').join(',')})`,
//   targetIds
// );

// for (const p of products) {
//   console.log(`🔍 Crawling: ${p.name}`);

//   const res = await fetch(
//     `https://api.unsplash.com/search/photos?query=${encodeURIComponent(p.name)}&per_page=3`,
//     {
//       headers: {
//         Authorization: 'Client-ID vUfFNpSefdOKBvS_tkP0rAtStNsIxaa377dW5xR1c3E'
//       }
//     }
//   );

//   const data = await res.json();

//   if (!data.results?.length) continue;

//   let index = 0;

//   for (const img of data.results.slice(0, 3)) {
//     const imageUrl = img.urls.regular;
//     if (!imageUrl) continue;

//     try {
//       const uploaded = await cloudinary.uploader.upload(imageUrl, {
//         folder: 'products'
//       });

//       await connection.execute(
//         `INSERT INTO product_images 
//         (product_id, image_url, public_id, is_thumbnail, sort_order)
//         VALUES (?, ?, ?, ?, ?)`,
//         [
//           p.id, // 🔥 dùng trực tiếp từ DB
//           uploaded.secure_url,
//           uploaded.public_id,
//           index === 0,
//           index
//         ]
//       );

//       index++;
//     } catch (err) {
//       console.error('❌ Upload lỗi:', err.message);
//     }
//   }

//   console.log(`✅ Done: ${p.name}`);
// }

await connection.end();