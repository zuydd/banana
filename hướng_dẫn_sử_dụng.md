**_ Hướng dẫn cài đặt _**

- B1: Tải và giải nén tool
- B2: Chạy lệnh: npm install để cài đặt thư viện bổ trợ
- B3: vào thư mục src -> data, nhập query vào file users.txt và proxy vào file proxy.txt, không có proxy thì bỏ qua khỏi nhập

**_ Các lệnh chức năng chạy tool _**

- npm run start: dùng để chạy claim, làm nhiệm vụ, harvest,.... tóm lại game có gì là nó làm cái đó
- npm run summary: để xem thống kê chuối trong các tài khoản
- npm run sell: để bán chuối hàng loạt
  các lệnh trên chạy hoàn toàn độc lập với nhau

🕹️ Các tính năng có trong tool:

- Đa luồng, đếm ngược thời gian claim chuối riêng từng acc, tối ưu tối đa số chuối nhận được
- Tự động nhận diện proxy
- Làm nhiệm vụ và claim lượt harvest (mỗi 3 nhiệm vụ)
- Tự động claim chuối nhận được khi giới thiệu (invite)
- Tự động dùng chuối xịn nhất
- Tự động claim khi tới giờ
- Tap và nhận speedup
- Tự động dùng speedup (tối đa 2 lần một lượt, còn tại sao thì tự động não suy nghĩ đi 🤣)
- Tự động harvest khi có lượt, share sau khi harvest (3 share nhận thêm 1 lượt)
- Tự động ghi nhận chuối có giá trị lớn (mặc định >= 0.05 USDT) khi harvest vào file log.txt để tiện theo dõi. Tìm biến PRICE_LOG = 0.05 thay 0.05 thành số thích hợp
- Thống kê danh sách tài khoản có chứa chuối có giá trị cao (mặc định >= 0.05 USDT). Tìm biến PRICE_MIN = 0.05 thay 0.05 thành số thích hợp
- Bán chuối hàng loạt
- Tự động chuyển đổi định dạng query_id, encode hay decode vứt vô chạy láng hết, chứ nhìn mấy ông lấy cái query_id khổ cực quá 🤣
- Mặc định ở vòng lặp đầu tiên mỗi tài khoản sẽ chạy cách nhau 6s để tránh spam request, có thể tìm biến DELAY_ACC = 6 để điều chỉnh
