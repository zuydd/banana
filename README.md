![Banana banner](https://raw.githubusercontent.com/zuydd/image/main/banana.webp)

# Tool Auto Banana NodeJS by ZuyDD

**Tool phát triển và chia sẻ miễn phí bởi ZuyDD**

<a href="https://www.facebook.com/zuy.dd"><img src="https://raw.githubusercontent.com/zuydd/image/main/facebook.svg" alt="Facebook"></a>
<a href="https://t.me/zuydd"><img src="https://raw.githubusercontent.com/zuydd/image/main/telegram.svg" alt="Telegram"></a>

> [!WARNING]
> Mọi hành vi buôn bán tool dưới bất cứ hình thức nào đều không được cho phép!

## 🛠️ Hướng dẫn cài đặt

> Yêu cầu đã cài đặt NodeJS

- Bước 1: Tải về phiên bản mới nhất của tool [tại đây ⬇️](https://github.com/zuydd/banana/archive/refs/heads/main.zip)
- Bước 2: Giải nén tool
- Bước 3: Tại thư mục tool vừa giải nén, chạy lệnh `npm install` để cài đặt các thư viện bổ trợ

> [!CAUTION]
>
> - ❗❗❗ PHẢI ĐỌC TRƯỚC KHI DÙNG ❗❗❗
> - Game họ bật cloudflare hạn chế bot nên không thể request quá nhanh, nếu chạy nhanh IP sẽ bị ban 6-12h dẫn đến lỗi 429. Vậy nên đừng ông nào hỏi sao tool chạy chậm thế
> - Vui lòng sử dụng proxy sạch chưa bị cloudflare ban 429 để chạy tool, nếu proxy đang bị ban, vui lòng chờ chạy sau 8-12h
> - Cơ chế tranh spam của tool sẽ delay mỗi request 10 giây, dẫn đến một số việc như tap sẽ lâu xong hơn do phải gọi nhiều request
> - Tool vẫn có thể chạy đa luồng nhưng trong cùng một lúc sẽ không có 2 luồng cùng chạy một proxy, vì thế nên sắp xếp proxy xen kẽ nhau để tối ưu tốc độ, đừng sắp xếp các proxy giống nhau nằm gần nhau
> - Nếu bạn không chạy proxy tool sẽ chạy lần lượt các tài khoản (không đa luồng)
> - Nếu gặp lỗi 429, bạn có thể thay proxy khác hoặc chờ tool thử lại sau 8 giờ, bạn có thể thay đổi thời gian thử lại bằng cách tìm biến `TIME_RETRY_429 = 480`
> - Bản cập nhật này chỉ hạn chế bị lỗi 429, không thể giải quyết triệt để 100% vậy nên vẫn có tỷ lệ nhỏ bị lỗi, chúng tôi đã cố gắng hết sức 😥😥
> - Và cuối cùng: chạy chậm còn hơn không chạy được vậy nên đừng phàn nàn nhé

## 💾 Cách thêm dữ liệu tài khoản

> Tool sử dụng `query_id=` hoặc `user=` làm dữ liệu đầu vào cho mỗi tài khoản

> Tất cả dữ liệu mà bạn cần nhập đều nằm ở các file trong thư mục 📁 `src / data`

- [users.txt](src/data/users.txt) : chứa danh sách `query_id` hoặc `user` của các tài khoản, mỗi dòng ứng với một tài khoản
- [proxy.txt](src/data/proxy.txt) : chứa danh sách proxy, proxy ở mỗi dòng sẽ ứng với tài khoản ở dòng đó trong file users.txt phía trên, để trống nếu không dùng proxy. Nếu muốn 1 tài khoản nào đó không dùng proxy thì gõ vào chữ `skip` ở dòng ứng với tài khoản đó
- [token.json](src/data/token.json) : chứa danh sách token được tạo ra từ `query_id` hoặc `user`. Có thể copy token từ các tool khác qua file này (miễn cùng format) để chạy.

> Định dạng proxy: http://user:pass@ip:port

> Lưu ý: Nếu nhận được thông báo đăng nhập thất bại, hãy lấy mới lại `query_id` hoặc `user`

## >\_ Các lệnh và chức năng tương ứng

| Lệnh              | Chức năng                                                                          |
| ----------------- | ---------------------------------------------------------------------------------- |
| `npm run start`   | Dùng để chạy claim, làm nhiệm vụ, harvest,.... tóm lại game có gì là nó làm cái đó |
| `npm run summary` | Dùng để xem thống kê chuối trong các tài khoản                                     |
| `npm run sell`    | Dùng để bán chuối hàng loạt                                                        |

> Các lệnh trên chạy hoàn toàn độc lập với nhau

## 🕹️ Các tính năng có trong tool

- Đa luồng, đếm ngược thời gian claim chuối riêng từng acc, tối ưu tối đa số chuối nhận được
- Tự động nhận diện proxy
- Làm nhiệm vụ và claim lượt harvest (mỗi 3 nhiệm vụ)
- Tự động claim chuối nhận được khi giới thiệu (invite)
- Tự động dùng chuối xịn nhất
- Tự động claim khi tới giờ
- Tap và nhận speedup
- Tự động dùng speedup (tối đa 2 lần một lượt, còn tại sao thì tự động não suy nghĩ đi 🤣)
- Tự động harvest khi có lượt, share sau khi harvest (3 share nhận thêm 1 lượt)
- Tự động ghi nhận chuối có giá trị lớn (mặc định >= 0.05 USDT) khi harvest vào file log.txt để tiện theo dõi. Tìm biến `PRICE_LOG = 0.05` thay 0.05 thành số thích hợp
- Thống kê danh sách tài khoản có chứa chuối có giá trị cao (mặc định >= 0.05 USDT). Tìm biến `PRICE_MIN = 0.05` thay 0.05 thành số thích hợp
- Bán chuối hàng loạt
- Tự động chuyển đổi định dạng query_id, encode hay decode vứt vô chạy láng hết, chứ nhìn mấy ông lấy cái query_id khổ cực quá 🤣
- đa luồng chạy bao nhiêu acc cũng được, không bị block lẫn nhau, lặp lại khi tới thời gian claim
- hiển thị đếm ngược tới lần chạy tiếp theo, có thể tìm biến `IS_SHOW_COUNTDOWN = true` đổi thành `false` để tắt cho đỡ lag

## ♾ Cài đặt đa luồng

- Mặc định tool sẽ chạy đa luồng ứng với số tài khoản bạn nhập vào, không cần cài đặt thêm gì cả.
- Mặc định ở vòng lặp đầu tiên mỗi tài khoản (luồng) sẽ chạy cách nhau 30s để tránh spam request, có thể tìm biến `DELAY_ACC = 30` trong file [index.js](src/run/index.js) để điều chỉnh cho phù hợp

## ❌ Chế độ thử lại khi lỗi

- Đỗi với lỗi kết nối proxy, hệ thống sẽ cố thử lại sau mỗi 30s, bạn có thể cài đặt giới hạn số lần thử lại bằng cách tìm biến `MAX_RETRY_PROXY = 20` trong file [index.js](src/run/index.js) để điều chỉnh cho phù hợp (mặc định là 20). Khi quá số lần thử kết nối lại hệ thống sẽ dừng auto tài khoản đó và nghi nhận lỗi vào file [log.error.txt](src/data/log.error.txt)
- Đỗi với lỗi đăng nhập thất bại, hệ thống sẽ cố thử lại sau mỗi 60s, bạn có thể cài đặt giới hạn số lần thử lại bằng cách tìm biến `MAX_RETRY_LOGIN = 20` trong file [index.js](src/run/index.js) để điều chỉnh cho phù hợp (mặc định là 20). Khi quá số lần thử đăng nhập lại hệ thống sẽ dừng auto tài khoản đó và nghi nhận lỗi vào file [log.error.txt](src/data/log.error.txt)

## 🔄 Lịch sử cập nhật

> Phiên bản mới nhất: `v0.0.7`

<details>
<summary>v0.0.7 - 📅 18/09/2024</summary>
  
- Fix lỗi crash tool khi không nhập proxy
</details>
<details>
<summary>v0.0.6 - 📅 17/09/2024</summary>
  
- Thêm cơ chế delay request và hàng chờ proxy để hạn chế bị lỗi 429
- Thêm xem quảng cáo nhận thưởng khi mở chuối
- Thêm thông báo từ hệ thống và kiểm tra version
- Thêm đếm ngược đến lần chạy tiếp theo
</details>
<details>
<summary>v0.0.5 - 📅 11/09/2024</summary>
  
- Thêm chức năng xem quảng cáo nhận thưởng sau khi tap xong và trước khi speedup
</details>
<details>
<summary>v0.0.4 - 📅 06/09/2024</summary>
  
- Thêm danh sách các task bỏ qua không làm
</details>
<details>
<summary>v0.0.3 - 📅 20/08/2024</summary>
  
- Fix bug crash tool
- Bổ sung readme
</details>
<details>
<summary>v0.0.2 - 📅 18/08/2024</summary>
  
- Fix bug
</details>

## 🎁 Donate

Chúng tôi rất vui được chia sẻ các mã script và tài nguyên mã nguồn miễn phí đến cộng đồng làm airdrop. Nếu bạn thấy các công cụ và tài liệu của chúng tôi hữu ích và muốn ủng hộ chúng tôi tiếp tục phát triển và duy trì các dự án này, bạn có thể đóng góp hỗ trợ qua hình thức donate.

Mỗi đóng góp của bạn sẽ giúp chúng tôi duy trì chất lượng dịch vụ và tiếp tục cung cấp những tài nguyên giá trị cho cộng đồng làm airdrop. Chúng tôi chân thành cảm ơn sự hỗ trợ và ủng hộ của bạn!

Mãi iu 😘😘😘

<div style="display: flex; gap: 20px;">
  <img src="https://raw.githubusercontent.com/zuydd/image/main/qr-momo.png" alt="QR Momo" height="340" />
  <img src="https://raw.githubusercontent.com/zuydd/image/main/qr-binance.jpg" alt="QR Binance" height="340" />
</div>
