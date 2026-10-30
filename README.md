# LANDMART - Hệ Thống Xếp Lịch Dọn Vệ Sinh

Ứng dụng web quản lý và tự động xếp lịch dọn vệ sinh hàng tuần cho hệ thống siêu thị / tòa nhà LANDMART.

## 🚀 Tính năng chính

- **Xếp lịch thông minh theo ngày trong tuần:** Tự động tính toán các ngày Thứ 2, Thứ 4, Thứ 6 theo từng tháng và tuần làm việc trong năm.
- **Tự động nhận diện ngày nghỉ lễ:** Tự động kiểm tra và đánh dấu các ngày lễ cố định (01/01, 30/04, 01/05, 02/09) và chuyển sang chế độ "Nghỉ lễ".
- **Cấu hình & Tự động phân tách nội dung:** Hỗ trợ nhập liệu nhanh bằng cách copy & paste danh sách công việc hàng loạt; hệ thống tự động tách khung giờ và tên công việc tương ứng.
- **Giao diện bảng trực quan:** Phối màu thương hiệu LANDMART (đỏ `#cc0000`, vàng `#ffea00`), hiển thị dạng bảng rõ ràng, tối ưu cho in ấn và theo dõi thực địa.

## 🛠️ Cài đặt & Chạy ứng dụng

### Yêu cầu
- Node.js (khuyến nghị phiên bản 18 trở lên)
- Trình quản lý gói `npm`, `yarn` hoặc `pnpm`

### Cài đặt thư viện dependencies
```bash
npm install
```

### Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```

### Xây dựng bản phát hành (Production Build)
```bash
npm run build
```

## 🌐 Triển khai (Deployment)

Dự án đã được cấu hình sẵn các file deploy YAML:
1. **GitHub Pages (`.github/workflows/deploy.yml`):** Tự động build và deploy lên GitHub Pages mỗi khi push code lên nhánh `main`. Để kích hoạt, vào **Settings** > **Pages** trên repo GitHub và chọn **Source: GitHub Actions**.
2. **Render (`render.yaml`):** Hỗ trợ deploy dạng Static Site tự động trên Render.

## 📁 Cấu trúc thư mục

```
landmart/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD GitHub Actions deploy GitHub Pages
├── render.yaml             # Cấu hình deploy Static Site trên Render
├── landmartschedule.tsx    # File component gốc của hệ thống xếp lịch
├── src/
│   ├── App.tsx             # Component chính (giao diện lịch dọn vệ sinh)
│   ├── main.tsx            # Entry point của ứng dụng React
│   └── index.css           # Cấu hình Tailwind CSS
├── index.html              # Trang HTML chính
├── package.json            # Định nghĩa các package phụ thuộc & scripts
├── tailwind.config.js      # Cấu hình Tailwind CSS
├── tsconfig.json           # Cấu hình TypeScript
└── vite.config.ts          # Cấu hình Vite bundler
```

