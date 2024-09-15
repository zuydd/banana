![Banana banner](https://raw.githubusercontent.com/zuydd/image/main/banana.webp)

# Tool Auto Banana NodeJS by ZuyDD

**Tool phát triển và chia sẻ miễn phí bởi ZuyDD**

<a href="https://www.facebook.com/zuy.dd"><img src="https://raw.githubusercontent.com/zuydd/image/main/facebook.svg" alt="Facebook"></a>
<a href="https://t.me/zuydd"><img src="https://raw.githubusercontent.com/zuydd/image/main/telegram.svg" alt="Telegram"></a>

> [!CAUTION]
> Bên game họ bật cloudflare chặn bot truy cập nên request từ tool đến server đang bị lỗi 429, tạm thời vẫn chưa tìm được cách khắc phục, trên các hội nhóm có share tool chạy bằng python ae có thể kham khảo sử dụng tạm nhưng nhớ rằng các tool đấy vẫn chưa chạy được với proxy vì lắp proxy vô là lại ăn chặn 429 nên cân nhắc không log nhiều acc vào tránh bị quét. Khi nào tìm được giải pháp khắc phục được và đảm bào an toàn mình sẽ thông báo tới mọi người. Cảm ơn mọi người đã ủng hộ tool trong thời gian qua 🥰

> [!WARNING]
> Mọi hành vi buôn bán tool dưới bất cứ hình thức nào đều không được cho phép!

## 🛠️ Hướng dẫn cài đặt

> Yêu cầu đã cài đặt NodeJS

- Bước 1: Tải về phiên bản mới nhất của tool [tại đây ⬇️](https://github.com/zuydd/banana/archive/refs/heads/main.zip)
- Bước 2: Giải nén tool
- Bước 3: Tại thư mục tool vừa giải nén, chạy lệnh `npm install` để cài đặt các thư viện bổ trợ

## 💾 Cách thêm dữ liệu tài khoản

> Tool sử dụng `query_id` làm dữ liệu đầu vào cho mỗi tài khoản

> Tất cả dữ liệu mà bạn cần nhập đều nằm ở các file trong thư mục 📁 `src / data`

- [users.txt](src/data/users.txt) : chứa danh sách `query_id` của các tài khoản, mỗi dòng ứng với một tài khoản
- [proxy.txt](src/data/proxy.txt) : chứa danh sách proxy, proxy ở mỗi dòng sẽ ứng với tài khoản ở dòng đó trong file users.txt phía trên, để trống nếu không dùng proxy
- [token.json](src/data/token.json) : chứa danh sách token được tạo ra từ `query_id`. Có thể copy token từ các tool khác qua file này (miễn cùng format) để chạy.

> Định dạng proxy: http://user:pass@ip:port

> Lưu ý: Nếu nhận được thông báo đăng nhập thất bại, hãy lấy mới lại `query_id`

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
- Mặc định ở vòng lặp đầu tiên mỗi tài khoản sẽ chạy cách nhau 6s để tránh spam request, có thể tìm biến `DELAY_ACC = 6` để điều chỉnh

## 🔄 Lịch sử cập nhật

> Phiên bản mới nhất: `v0.0.5`

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
