# Sun Group – trang test các section

HTML/CSS/JS thuần, không cần build. Thứ tự trên trang:

1. **Section 1 – Về Sun Group + Hệ sinh thái** (Figma node `1:183`)
2. Section 2 – placeholder: div trắng cao 1080px (đang có người khác làm)
3. **Section 3 – Viết nên bản giao hưởng cho mỗi vùng đất** (Figma page "section 3", frame `10:1692` + storyboard)
4. Section 4 – placeholder: div trắng cao 1080px (đang có người khác làm)

## Cấu trúc

```
index.html            Toàn bộ section: markup + <style> (desktop chuẩn 1440px, responsive xuống 360px)
                      + <script> ở cuối file (tương tác vòng tròn, nội dung 5 lĩnh vực trong mảng SECTORS)
assets/fonts/         CDA Independence (variable, trục Text, wght 400–700) dạng woff2
assets/img/           Section 1: ảnh mảng vòng tròn, nhãn cong, ảnh nội dung (WebP)
assets/img/sym/       Section 3: ảnh của 5 chủ đề (WebP 1920 × 1200)
assets/svg/           Huy hiệu "Du lịch", la bàn nền, đường cung trang trí, khung cục section 3
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

## Section 3 – Bản giao hưởng

- **Desktop:** khi tới section, cuộn dọc sẽ làm dải 5 cục chạy ngang (section được ghim lại). Lướt qua hết 5 cục thì
  cuộn tiếp là sang section 4.
- **Bấm 1 cục:** chữ và hình của cục tách ra (chữ bay lên, hình hạ xuống), rồi hình vòm nở thành ảnh toàn màn hình kèm
  chữ "Viết nên bản giao hưởng…" ở dưới.
- **Mỗi lần cuộn / vuốt = 1 ảnh** (~1s): lớp ảnh mới phủ lên từ phải sang kèm viền sáng vàng, hai ảnh lệch nhau 5% tạo parallax.
  Trackpad vuốt mạnh cũng chỉ sang 1 ảnh (bỏ qua quán tính).
- **Hết ảnh của 1 chủ đề:** màn đỏ mang tên chủ đề kế trượt vào từ phải, hình vòm mọc lên từ dưới rồi nở ra. Cuộn ngược thì đi ngược lại.
- **Hết chủ đề cuối:** ảnh thu về hình vòm, rơi xuống, trở lại cuối dải cục để cuộn tiếp.
  Cuộn ngược ở ảnh đầu tiên thì hình thu về đúng cục ban đầu.
- Mỗi chuỗi nhiều chặng (mở cục, sang chủ đề, thoát) chạy theo một đường cong liền mạch qua các điểm mốc của
  storyboard (nội suy PCHIP + 1 easing chung), nên không có điểm dừng giữa các chặng.
- Phím mũi tên / Page Up-Down / Space để chuyển, Esc hoặc nút × để thoát. Bật "giảm chuyển động" thì chỉ đổi ảnh, không chạy hiệu ứng.
- **Mobile/tablet (< 1024px):** dải cục vuốt ngang tự nhiên, bấm vào mở màn chi tiết toàn màn hình, vuốt lên/trái để sang ảnh kế.
- Code: CSS ở cuối thẻ `<style>`, JS ở khối `Section 3` cuối thẻ `<script>`. Dữ liệu chủ đề + ảnh nằm trong mảng `TOPICS`.

## Cần thay

- Section 3: ảnh của từng chủ đề đang là **ảnh tạm** lấy trong file Figma (mỗi chủ đề 2 ảnh, `assets/img/sym/`).
  Thay ảnh thật thì sửa mảng `TOPICS` trong `<script>` (thêm bao nhiêu ảnh cũng được). Ảnh nên 1920 × 1200, WebP.
- Section 3: chữ trên ảnh toàn màn hình đang dùng chung câu "Viết nên bản giao hưởng cho mỗi vùng đất" như trong Figma.
- Section 1: mô tả của 4 lĩnh vực **Bất động sản, Giải trí nghỉ dưỡng, Điện ảnh & nghệ thuật biểu diễn, Y tế** đang là nội dung tạm
  (đã canh đủ 5 dòng ở desktop như "Hàng không") → sửa trong `<script>` cuối `index.html` (mảng `SECTORS`).
  Mô tả của "Hàng không" đang lấy đúng text trong Figma. Content thật nên giữ khoảng 250–270 ký tự để vẫn 5 dòng.
- Section 1: ảnh nội dung từng lĩnh vực: `assets/img/photo-*.webp` (tỉ lệ 437 × 270).
