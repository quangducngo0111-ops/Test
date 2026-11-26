# Thêm bộ nhận điểm Reading mà không ảnh hưởng AI chấm Writing

## Tình trạng

Dự án Apps Script hiện tại có `doPost(e)` phục vụ cả Writing AI (`p.mode === 'writingGrade'`) và Listening/Reading. **Không thay toàn bộ file `Mã.gs` bằng `Code.gs` độc lập**, vì điều đó sẽ làm mất nhánh Writing.

`ReadingAddon.gs` là tệp bổ sung, chỉ cung cấp hàm trợ giúp (không khai báo lại `doPost` / `doGet`).

## Sửa trong dự án Apps Script đang mở

1. Sao lưu toàn bộ mã hiện hành.
2. Tạo tệp mới qua dấu `+` → **Script**, đặt tên **ReadingAddon** và dán toàn bộ [ReadingAddon.gs](ReadingAddon.gs).
3. Trong **hàm doPost(e) hiện có**, ngay sau khi khai báo `p` là `e.parameter`, thêm:

```javascript
if (scReadingEligible_(p)) return scReadingPost_(p);
```

Thêm **trước** các nhánh nhận điểm Reading/Listening cũ, nhưng nhánh Writing vẫn giữ nguyên và không bị điều kiện trên bắt vì `mode = writingGrade`.

4. Trong **hàm doGet(e) hiện có**, ngay sau khi khai báo `p` là `e.parameter`, thêm:

```javascript
if (p.action === 'health' || p.action === 'status') {
  return scReadingGet_(p);
}
```

Nếu `doGet` đã có nghiệp vụ `action=status`, cần so sánh trước, không ghi đè mù quáng. Khi đó sửa riêng URL hành động ở frontend theo hợp đồng xác nhận `attemptId`.

5. Save, **Deploy → Manage deployments → Edit → New version** (để giữ URL `/exec` cũ nếu đúng dự án).
6. Mở `/exec?action=health`, mong đợi `{"ok":true,"ready":true,"version":"2026-11-26-addon-v1"}`.
7. Thử gửi **một bản ghi giả lập** với các trường `mode=PRACTICE,skill=Reading,name=TEST,className=TEST,practiceId=INTEGRATION-TEST,score=1,total=1,attemptId=<mã duy nhất>`. Xác nhận một hàng mới trong `PRACTICE_RESULTS` và một hàng trong `_SC_ATTEMPT_INDEX`; cùng `attemptId` gửi lại không được tạo hàng thứ hai. Chỉ xóa đúng bản ghi thử nghiệm.
8. Nếu deployment URL thay đổi, cập nhật `ENDPOINT` ở `Practice/shared/attempt-history.js` và làm mới phiên bản tải script. **Không tuyên bố đã gửi thành công chỉ dựa vào `no-cors`**.

## Không gửi lại kết quả cũ một cách tự động

Những lượt đã nộp trước khi triển khai bản sửa có thể đã được chuyển đến Sheet nhưng không được xác nhận. Cần kiểm tra lịch sử và mã lượt theo từng học viên để tránh sinh hàng trùng. Trình duyệt có thể còn dữ liệu tại `SC_ATTEMPT_HISTORY_V1` và `SC_RESULT_OUTBOX_V2`.

## Phân biệt

- **Reading Practice**: bài chấm điểm → ghi `PRACTICE_RESULTS` hoặc `TEST_RESULTS`.
- **Reading Library**: bài đọc tự do không chấm điểm → lưu tiến độ/ghi chú ở trình duyệt, không tạo hàng điểm trong Sheet.
