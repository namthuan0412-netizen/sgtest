# Sun Group – Section "Về Sun Group" + Hệ sinh thái

Section dựng từ Figma (node `1:183`), HTML/CSS/JS thuần, không cần build.

## Cấu trúc

```
index.html            Toàn bộ section: markup + <style> (desktop chuẩn 1440px, responsive xuống 360px)
                      + <script> ở cuối file (tương tác vòng tròn, nội dung 5 lĩnh vực trong mảng SECTORS)
assets/fonts/         CDA Independence (variable, trục Text, wght 400–700) dạng woff2
assets/img/           Ảnh mảng vòng tròn, nhãn cong, ảnh nội dung (WebP)
assets/svg/           Huy hiệu "Du lịch", la bàn nền, đường cung trang trí
```

## Chạy thử trên máy

```bash
npx serve .
# hoặc
python3 -m http.server 8080
```

## Deploy lên Vercel (repo github.com/namthuan0412-netizen/sgtest)

Lần đầu – đẩy code lên repo (chạy trong folder này):

```bash
cd ~/Desktop/sungroup-section
git init -b main
git add .
git commit -m "Section Về Sun Group + hệ sinh thái"
git remote add origin https://github.com/namthuan0412-netizen/sgtest.git
git push -u origin main
```

Sau đó vào vercel.com → Add New → Project → Import repo `sgtest` → Framework Preset = **Other**,
để trống Build Command / Output Directory → Deploy. Từ lần sau chỉ cần `git add . && git commit -m "..." && git push`,
Vercel tự build bản mới.

Hoặc không dùng GitHub: `npx vercel` (preview) và `npx vercel --prod` (production) ngay trong folder này.

`.gitignore` và `.vercelignore` đã loại folder font gốc `CDA Independence 260313`, nên nó không bị đẩy lên GitHub hay public lên web.

## Tương tác

- Hover một mảng: mảng sáng lên (xem trước).
- Khi chọn mảng mới, nội dung xuất hiện theo hiệu ứng **"Nhịp trống"** (lấy cảm hứng từ trống đồng Đông Sơn):
  trống đồng nảy, loé sáng và bung 14 tia nắng như vừa được gõ, sóng xung kích + 3 vòng sóng âm vàng (nét liền / chấm / vạch,
  gợi các vành hoa văn trên mặt trống) lan ra; ảnh mở theo hình tròn từ phía vòng tròn với vầng sáng hoàng kim: mép sóng
  rực sáng kèm 14 tia nắng (như ngôi sao 14 cánh giữa mặt trống đồng), hạt sáng lấp lánh rơi lại sau
  mép sóng, màu ảnh nở từ sắc đồng thau sang màu thật rồi một vệt sáng hoàng kim lướt qua; ngôi sao mặt trời xoay vào vị trí, tiêu đề lắng nét, mô tả lan theo từng chữ.
  Bấm liên tục vẫn mượt (hiệu ứng cũ bị huỷ và thay ngay). Toàn bộ code nằm trong khối `"NHỊP TRỐNG"` ở `<script>`.
- Click / chạm (hoặc Tab + Enter, phím mũi tên): chọn mảng, nội dung bên phải đổi theo; nhãn cong của mảng đang chọn ẩn đi như design.
- Trống đồng "Du lịch" ở giữa xoay chậm theo chiều kim đồng hồ; 2 vòng line trang trí (hồng + vàng) xoay ngược chiều.
  Chỉnh tốc độ bằng biến `--spin-drum`, `--spin-lines-outer`, `--spin-lines-inner` trong thẻ `<style>` của `index.html`.
- Khối tiêu đề + mô tả luôn giữ chiều cao bằng lĩnh vực dài nhất ở bề rộng hiện tại, nên chuyển qua lại không bị giật.
  Tất cả chuyển động tắt khi người dùng bật "giảm chuyển động" (prefers-reduced-motion).

## Cần thay

- Mô tả của 4 lĩnh vực **Bất động sản, Giải trí nghỉ dưỡng, Điện ảnh & nghệ thuật biểu diễn, Y tế** đang là nội dung tạm
  (đã canh đủ 5 dòng ở desktop như "Hàng không") → sửa trong `<script>` cuối `index.html` (mảng `SECTORS`).
  Mô tả của "Hàng không" đang lấy đúng text trong Figma. Content thật nên giữ khoảng 250–270 ký tự để vẫn 5 dòng.
- Ảnh nội dung từng lĩnh vực: `assets/img/photo-*.webp` (tỉ lệ 437 × 270).
