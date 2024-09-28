import colors from "colors";
import dayjs from "dayjs";
import delayHelper from "../helpers/delay.js";
import fileHelper from "../helpers/file.js";
import ipClass from "../helpers/ip.js";
import authService from "../services/auth.js";
import bananaService from "../services/banana.js";
import server from "../services/server.js";
import userService from "../services/user.js";

const VERSION = "v0.0.9";
// Điều chỉnh khoảng cách thời gian chạy vòng lặp đầu tiên giữa các luồng tránh bị spam request (tính bằng giây)
const DELAY_ACC = 30;
// Đặt số lần thử kết nối lại tối đa khi proxy lỗi, nếu thử lại quá số lần cài đặt sẽ dừng chạy tài khoản đó và ghi lỗi vào file log
const MAX_RETRY_PROXY = 20;
// Đặt số lần thử đăng nhập tối đa khi đăng nhập lỗi, nếu thử lại quá số lần cài đặt sẽ dừng chạy tài khoản đó và ghi lỗi vào file log
const MAX_RETRY_LOGIN = 20;
let ips = [];

const run = async (user, index) => {
  let countRetryProxy = 0;
  let countRetryLogin = 0;

  await delayHelper.delay((user.index - 1) * DELAY_ACC);
  while (true) {
    const ip = ipClass.getIP(user.proxy);

    // Kiẻm tra IP có đang dùng hay không
    const isIpActive = ipClass.isIpActive(user.proxy, ips);
    if (isIpActive.active) {
      user.log.log(
        colors.yellow(
          `proxy có IP ${
            isIpActive.ip
          } đang được sử dụng ở một luồng khác, để tránh spam request hệ thống sẽ thử lại sau: ${colors.blue(
            "60s"
          )}`
        )
      );
      await delayHelper.delay(60);
      continue;
    } else {
      ips.push(ip);
    }

    // Kiểm tra kết nối proxy
    let isProxyConnected = false;
    while (!isProxyConnected) {
      const ip = await user.http.checkProxyIP();
      if (ip === -1) {
        user.log.logError(
          "Proxy lỗi, kiểm tra lại kết nối proxy, sẽ thử kết nối lại sau 30s"
        );
        countRetryProxy++;
        if (countRetryProxy >= MAX_RETRY_PROXY) {
          break;
        } else {
          await delayHelper.delay(30);
        }
      } else {
        countRetryProxy = 0;
        isProxyConnected = true;
      }
    }
    try {
      if (countRetryProxy >= MAX_RETRY_PROXY) {
        const dataLog = `[No ${user.index} _ ID: ${
          user.info.id
        } _ Time: ${dayjs().format(
          "YYYY-MM-DDTHH:mm:ssZ[Z]"
        )}] Lỗi kết nối proxy - ${user.proxy}`;
        fileHelper.writeLog("log.error.txt", dataLog);
        break;
      }

      if (countRetryLogin >= MAX_RETRY_LOGIN) {
        const dataLog = `[No ${user.index} _ ID: ${
          user.info.id
        } _ Time: ${dayjs().format(
          "YYYY-MM-DDTHH:mm:ssZ[Z]"
        )}] Lỗi đăng nhập thất bại quá ${MAX_RETRY_LOGIN} lần`;
        fileHelper.writeLog("log.error.txt", dataLog);
        break;
      }
    } catch (error) {
      user.log.logError("Ghi lỗi thất bại");
    }

    // Đăng nhập tài khoản
    const login = await authService.handleLogin(user);
    if (login.profile === 429) {
      countRetryLogin = MAX_RETRY_LOGIN;
      continue;
    }
    if (!login.status) {
      countRetryLogin++;
      await delayHelper.delay(60);
      ips = ips.filter((currentIp) => currentIp !== ip);
      continue;
    } else {
      countRetryLogin = 0;
    }

    const bananaInfo = await authService.getBananaEquipInfo(user);
    const bananas = await bananaService.getBananaList(user);
    await bananaService.handleSell(user, modeSell, bananas, bananaInfo);
    ips = ips.filter((currentIp) => currentIp !== ip);
    break;
  }
};

console.log(
  colors.yellow.bold(
    `=============  Tool phát triển và chia sẻ miễn phí bởi ZuyDD  =============`
  )
);
console.log(
  "Mọi hành vi buôn bán tool dưới bất cứ hình thức nào đều không được cho phép!"
);
console.log(
  `Telegram: ${colors.green(
    "https://t.me/zuydd"
  )}  ___  Facebook: ${colors.blue("https://www.facebook.com/zuy.dd")}`
);
console.log(
  `🚀 Cập nhật các tool mới nhất tại: 👉 ${colors.gray(
    "https://github.com/zuydd"
  )} 👈`
);
console.log("");
console.log("");

await server.checkVersion(VERSION);
await server.showNoti();
console.log("");

console.log(colors.red("⚠️  Lưu ý: Không thể bán chuối đang sử dụng!"));
console.log("");

const modeSell = await bananaService.selectModeSell();
console.log("");

const users = await userService.loadUser();

for (const [index, user] of users.entries()) {
  run(user, index);
}
