# Ecommerce

Dự án này được tạo bằng [Angular CLI](https://github.com/angular/angular-cli) phiên bản 21.2.7.

## Chạy môi trường phát triển

Để khởi động máy chủ phát triển cục bộ, chạy:

```bash
ng serve
```

Sau khi máy chủ chạy, mở trình duyệt và truy cập `http://localhost:4200/`. Ứng dụng sẽ tự động tải lại khi bạn thay đổi mã nguồn.

## Sinh mã khung

Angular CLI cung cấp công cụ sinh mã khung mạnh mẽ. Để tạo component mới, chạy:

```bash
ng generate component component-name
```

Để xem đầy đủ danh sách schematic khả dụng (như `components`, `directives`, `pipes`), chạy:

```bash
ng generate --help
```

## Build dự án

Để build dự án, chạy:

```bash
ng build
```

Lệnh này sẽ biên dịch dự án và lưu kết quả vào thư mục `dist/`. Mặc định, bản build production sẽ được tối ưu hiệu năng và tốc độ.

## Chạy kiểm thử đơn vị

Để chạy unit test bằng [Vitest](https://vitest.dev/), dùng lệnh:

```bash
ng test
```

## Chạy kiểm thử end-to-end

Để chạy kiểm thử end-to-end (e2e), chạy:

```bash
ng e2e
```

Angular CLI không đi kèm sẵn framework e2e theo mặc định. Bạn có thể chọn công cụ phù hợp với nhu cầu của mình.

## Tài liệu tham khảo

Để tìm hiểu thêm về Angular CLI, bao gồm tài liệu lệnh chi tiết, xem [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
