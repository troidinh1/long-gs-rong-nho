# LONG GS - Rong Nho Nha Trang Website

Website bán hàng fullstack mini cho thương hiệu **LONG GS**, lĩnh vực rong nho, thực phẩm sạch và đặc sản biển Nha Trang - Khánh Hòa.

Dự án được xây dựng bằng **Next.js App Router, TypeScript, Tailwind CSS, Supabase, Resend và Vercel**.

---

## Link demo

Website:

```text
https://long-gs-rong-nho.vercel.app/
```

Admin:

```text
https://long-gs-rong-nho.vercel.app/admin
```

---

## Tính năng chính

### Landing page bán hàng

* Header
* Hero section
* Bảng giá sản phẩm
* Video sản phẩm
* Lợi ích sản phẩm
* Khu vực dành cho đại lý
* Feedback mẫu
* FAQ
* Form đặt hàng
* Trang cảm ơn sau khi đặt hàng
* Nút Zalo cố định trên mobile
* Footer
* SEO metadata
* Ảnh chia sẻ Facebook/Zalo

### Form đặt hàng

* Lấy sản phẩm thật từ database
* Chọn sản phẩm
* Nhập số lượng
* Nhập địa chỉ giao hàng
* Chọn loại khách: khách lẻ hoặc đại lý
* Tự tính tổng tiền tạm tính
* Lưu đơn hàng vào Supabase
* Gửi email thông báo khi có đơn mới
* Chuyển khách sang trang `/thank-you`

### Admin Dashboard

* Đăng nhập bằng Supabase Auth
* Chỉ email admin được phép truy cập
* Xem danh sách đơn hàng
* Tạo đơn thủ công
* Sửa đơn hàng
* Xóa đơn hàng
* Đổi trạng thái đơn hàng
* Lọc đơn theo trạng thái
* Tìm kiếm theo tên, số điện thoại, sản phẩm, địa chỉ
* Thống kê tổng đơn, đơn mới, đơn đã chốt, doanh thu đơn đã chốt

### Quản lý sản phẩm

* Thêm sản phẩm
* Sửa sản phẩm
* Xóa sản phẩm
* Ẩn / hiện sản phẩm
* Upload ảnh sản phẩm bằng Supabase Storage
* Trang chủ tự cập nhật sản phẩm từ database
* Không cần sửa code khi đổi giá hoặc thêm sản phẩm mới

---

## Công nghệ sử dụng

* Next.js App Router
* TypeScript
* Tailwind CSS
* Supabase Database
* Supabase Auth
* Supabase Storage
* Resend Email
* Vercel Deploy
* GitHub

---

## Cấu trúc thư mục

```text
app
├── admin
├── api
├── thank-you
├── layout.tsx
└── page.tsx

components
├── admin
└── landing

lib
├── supabase
├── money.ts
├── sendOrderEmail.ts
└── supabaseAdmin.ts

types
├── order.ts
└── product.ts

public
├── images
└── videos
```

---

## Cài đặt local

Clone project:

```bash
git clone https://github.com/troidinh1/long-gs-rong-nho.git
cd long-gs-rong-nho
```

Cài package:

```bash
npm install
```

Tạo file môi trường:

```bash
cp .env.example .env.local
```

Điền biến môi trường vào `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
RESEND_API_KEY=
ORDER_NOTIFY_EMAIL=
RESEND_FROM_EMAIL=
```

Chạy local:

```bash
npm run dev
```

Mở trình duyệt:

```text
http://localhost:3000
```

---

## Biến môi trường

| Biến                            | Ý nghĩa                         |
| ------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL project Supabase            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key Supabase        |
| `SUPABASE_SERVICE_ROLE_KEY`     | Secret key dùng cho backend     |
| `ADMIN_EMAIL`                   | Email admin được phép đăng nhập |
| `RESEND_API_KEY`                | API key gửi email Resend        |
| `ORDER_NOTIFY_EMAIL`            | Email nhận thông báo đơn hàng   |
| `RESEND_FROM_EMAIL`             | Email gửi đi qua Resend         |

Không được đưa các key thật lên GitHub.

---

## Database

Dự án sử dụng 2 bảng chính:

### Bảng `orders`

Lưu đơn hàng từ website.

Các cột chính:

```text
id
name
phone
product
note
status
quantity
address
customer_type
total_price
created_at
```

### Bảng `products`

Lưu sản phẩm hiển thị trên trang chủ.

Các cột chính:

```text
id
name
weight
price
description
image_url
badge
is_active
sort_order
created_at
```

---

## Supabase Storage

Bucket dùng để upload ảnh sản phẩm:

```text
product-images
```

Bucket cần bật public để ảnh hiển thị được trên website.

---

## Deploy Vercel

Sau khi push code lên GitHub, Vercel sẽ tự deploy.

Cần thêm các biến môi trường trong Vercel:

```text
Project Settings → Environment Variables
```

Sau khi thêm hoặc sửa biến môi trường, cần redeploy lại project.

---

## Tài khoản admin

Admin đăng nhập tại:

```text
/admin/login
```

Chỉ email được khai báo trong biến môi trường `ADMIN_EMAIL` mới có quyền truy cập admin.

---

## Quy trình đặt hàng

```text
Khách vào website
→ Chọn sản phẩm
→ Nhập số lượng, địa chỉ, thông tin liên hệ
→ Gửi đơn
→ Đơn lưu vào Supabase
→ Email thông báo gửi về admin
→ Khách chuyển sang trang cảm ơn
→ Admin xử lý đơn trong dashboard
```

---

## Trạng thái đơn hàng

```text
new        = Đơn mới
contacted  = Đã liên hệ
confirmed  = Đã chốt
cancelled  = Đã hủy
```

---

## Ghi chú bảo mật

* Không push `.env.local` lên GitHub.
* Không gửi `SUPABASE_SERVICE_ROLE_KEY` cho người khác.
* Không gửi `RESEND_API_KEY` cho người khác.
* Chỉ dùng `SUPABASE_SERVICE_ROLE_KEY` trong backend API.
* Admin được bảo vệ bằng Supabase Auth và middleware.
* Nên bật RLS trong Supabase cho các bảng public.

---

## Tác giả

Dự án được xây dựng cho thương hiệu **LONG GS - Rong nho Nha Trang, Khánh Hòa**.
