# Hướng dẫn cài đặt trang khảo sát báo giá website

Gồm 3 file:

- `index.html`: trang khảo sát khách điền (8 bước, tông sáng).
- `Code.gs`: đoạn Google Apps Script nhận câu trả lời và ghi vào Google Sheets.
- `HUONG-DAN.md`: file này.

## Bước 1: Tạo Google Sheets và Apps Script

1. Tạo một Google Sheets mới, đặt tên ví dụ "Khảo sát báo giá web".
2. Vào menu **Tiện ích mở rộng → Apps Script**.
3. Xóa code mặc định, dán toàn bộ nội dung `Code.gs` vào và bấm **Lưu**.
4. (Tùy chọn) Điền email của bạn vào `NOTIFY_EMAIL` để nhận email mỗi khi có khảo sát mới.

## Bước 2: Triển khai thành Web App

1. Bấm **Triển khai (Deploy) → Tùy chọn triển khai mới (New deployment)**.
2. Bấm biểu tượng bánh răng và chọn loại **Ứng dụng web (Web app)**.
3. Thiết lập:
   - Thực thi dưới dạng (Execute as): **Tôi (Me)**
   - Người có quyền truy cập (Who has access): **Bất kỳ ai (Anyone)**
4. Bấm **Triển khai** và cấp quyền cho tài khoản Google của bạn. Nếu Google báo "ứng dụng chưa được xác minh", bấm **Nâng cao → Đi tới ... (không an toàn)**. Đây là script của chính bạn nên an toàn.
5. Sao chép **URL ứng dụng web**, có dạng `https://script.google.com/macros/s/.../exec`.
6. Thử mở URL đó trên trình duyệt. Nếu thấy dòng "Web App khảo sát đang hoạt động." là đã chạy.

Mỗi lần sửa `Code.gs`, vào **Triển khai → Quản lý các bản triển khai**, bấm sửa và chọn **Phiên bản mới** để cập nhật. URL giữ nguyên.

## Bước 3: Cấu hình trang khảo sát

Mở `index.html`, tìm phần `CẤU HÌNH` ở đầu thẻ `<script>`:

```js
SCRIPT_URL: "https://script.google.com/macros/s/.../exec",  // URL ở bước 2
BRAND_NAME: "Tên của bạn / studio",
BRAND_LOGO: "logo.png",          // đặt file logo cùng thư mục, hoặc để ""
CONTACT_ZALO: "09xx xxx xxx",
```

`PRICE_TIERS` là các mức độ phức tạp và khoảng giá **gợi ý nội bộ**. Các con số này chỉ ghi vào Google Sheets, khách không nhìn thấy. Bạn nên chỉnh lại theo bảng giá thực tế của mình.

## Bước 4: Đưa trang lên mạng

Chọn một trong các cách miễn phí sau:

- **Netlify Drop**: vào app.netlify.com/drop, kéo thả thư mục chứa `index.html` (và logo). Có link ngay.
- **GitHub Pages**: tạo repo, đẩy `index.html` lên, bật Pages trong Settings.
- **Vercel** hoặc **Railway**: nếu bạn đã quen dùng.

Sau đó gửi link cho khách. Khách không cần đăng nhập gì.

## Cách đọc kết quả trong Google Sheets

Mỗi khách gửi tạo một dòng mới trong tab "Câu trả lời". Mỗi câu hỏi là một cột. Ba cột cuối chỉ dành cho bạn:

- **Điểm phức tạp (nội bộ)**: tổng điểm từ các lựa chọn. Càng cao thì càng nhiều việc.
- **Mức độ (nội bộ)**: Cơ bản, Trung bình, Phức tạp, Rất phức tạp.
- **Gợi ý giá (nội bộ)**: khoảng giá tham khảo theo `PRICE_TIERS`.

Điểm chỉ là con số để bạn ước lượng nhanh. Khi báo giá thật, vẫn nên đọc kỹ từng câu trả lời, gọi khách làm rõ, rồi chia báo giá theo hạng mục: thiết kế, lập trình từng chức năng, nhập liệu, tên miền/hosting, bảo trì.

## Muốn sửa câu hỏi

Trong `index.html`, phần `STEPS` chứa toàn bộ câu hỏi. Mỗi lựa chọn có dạng `["Nhãn hiển thị", điểm]`. Bạn có thể thêm, bớt câu hỏi hoặc đổi điểm. Google Sheets sẽ tự thêm cột cho câu hỏi mới.
