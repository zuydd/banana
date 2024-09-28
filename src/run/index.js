import colors from "colors";
import dayjs from "dayjs";
import datetimeHelper from "../helpers/datetime.js";
import delayHelper from "../helpers/delay.js";
import fileHelper from "../helpers/file.js";
import generatorHelper from "../helpers/generator.js";
import ipClass from "../helpers/ip.js";
import authService from "../services/auth.js";
import { LotteryService } from "../services/lottery.js";
import questService from "../services/quest.js";
import server from "../services/server.js";
import tapService from "../services/tap.js";
import userService from "../services/user.js";

const VERSION = "v0.0.9";
// Điều chỉnh khoảng cách thời gian chạy vòng lặp đầu tiên giữa các luồng tránh bị spam request (tính bằng giây)
const DELAY_ACC = 30;
// Đặt số lần thử kết nối lại tối đa khi proxy lỗi, nếu thử lại quá số lần cài đặt sẽ dừng chạy tài khoản đó và ghi lỗi vào file log
const MAX_RETRY_PROXY = 20;
// Đặt số lần thử đăng nhập tối đa khi đăng nhập lỗi, nếu thử lại quá số lần cài đặt sẽ dừng chạy tài khoản đó và ghi lỗi vào file log
const MAX_RETRY_LOGIN = 20;
// Đặt thời gian thử đăng nhập lại (tính bằng phút) nếu gặp lỗi 429
const TIME_RETRY_429 = 480;
// Cài đặt đếm ngược đến lần chạy tiếp theo
const IS_SHOW_COUNTDOWN = true;
const countdownList = [];
let ips = [];

let database = {};
setInterval(async () => {
  const data = await server.getData();
  if (data) {
    database = data;
    server.checkVersion(VERSION, data);
  }
}, generatorHelper.randomInt(20, 40) * 60 * 1000);

const run = async (user, index) => {
  let countRetryProxy = 0;
  let countRetryLogin = 0;

  await delayHelper.delay((user.index - 1) * DELAY_ACC);
  while (true) {
    // Lấy lại dữ liệu từ server zuydd
    if (database?.ref) {
      user.database = database;
    }
    countdownList[index].running = true;
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
      countdownList[index].time = 60;
      countdownList[index].created = dayjs().unix();
      countdownList[index].running = false;
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
        ips = ips.filter((currentIp) => currentIp !== ip);
        break;
      }

      if (countRetryLogin >= MAX_RETRY_LOGIN) {
        const dataLog = `[No ${user.index} _ ID: ${
          user.info.id
        } _ Time: ${dayjs().format(
          "YYYY-MM-DDTHH:mm:ssZ[Z]"
        )}] Lỗi đăng nhập thất bại quá ${MAX_RETRY_LOGIN} lần`;
        fileHelper.writeLog("log.error.txt", dataLog);
        ips = ips.filter((currentIp) => currentIp !== ip);
        break;
      }
    } catch (error) {
      user.log.logError("Ghi lỗi thất bại");
    }

    // Đăng nhập tài khoản
    const login = await authService.handleLogin(user);
    if (login.profile === 429) {
      countdownList[index].time = TIME_RETRY_429 * 60;
      countdownList[index].created = dayjs().unix();
      countdownList[index].running = false;
      ips = ips.filter((currentIp) => currentIp !== ip);
      await delayHelper.delay(TIME_RETRY_429 * 60);
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

    const { quests, progress } = await questService.getQuestList(user);
    await questService.handleQuest(user, quests, progress);
    const lotteryService = new LotteryService();
    await lotteryService.handleLottery(user);
    // await bananaService.handleEquip(user, login?.profile?.equip_banana_id);
    const speedupCount = await tapService.handleTap(
      user,
      login?.profile?.max_click_count,
      login?.profile?.today_click_count,
      login?.profile?.speedup_count
    );
    const awaitTime = await tapService.handleSpeedUp(user, speedupCount);
    user.log.log(
      colors.magenta(
        `Đã hoàn thành hết công việc, chạy lại sau: ${colors.blue(
          `${awaitTime + 1} phút`
        )}`
      )
    );
    countdownList[index].time = (awaitTime + 1) * 60;
    countdownList[index].created = dayjs().unix();
    countdownList[index].running = false;
    ips = ips.filter((currentIp) => currentIp !== ip);
    await delayHelper.delay((awaitTime + 1) * 60);
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

server.checkVersion(VERSION);
server.showNoti();
console.log("");
const users = await userService.loadUser();

for (const [index, user] of users.entries()) {
  countdownList.push({
    running: true,
    time: 480 * 60,
    created: dayjs().unix(),
  });
  run(user, index);
}

if (IS_SHOW_COUNTDOWN && users.length) {
  let isLog = false;
  setInterval(() => {
    const isPauseAll = !countdownList.some((item) => item.running === true);

    if (isPauseAll) {
      if (!isLog) {
        console.log(
          "========================================================================================="
        );
        isLog = true;
      }
      const minTimeCountdown = countdownList.reduce((minItem, currentItem) => {
        // bù trừ chênh lệch
        const currentOffset = dayjs().unix() - currentItem.created;
        const minOffset = dayjs().unix() - minItem.created;
        return currentItem.time - currentOffset < minItem.time - minOffset
          ? currentItem
          : minItem;
      }, countdownList[0]);
      const offset = dayjs().unix() - minTimeCountdown.created;
      const countdown = minTimeCountdown.time - offset;
      process.stdout.write("\x1b[K");
      process.stdout.write(
        colors.white(
          `[${dayjs().format(
            "DD-MM-YYYY HH:mm:ss"
          )}] Đã chạy hết các luồng, cần chờ: ${colors.blue(
            datetimeHelper.formatTime(countdown)
          )}     \r`
        )
      );
    } else {
      isLog = false;
    }
  }, 1000);

  process.on("SIGINT", () => {
    console.log("");
    process.stdout.write("\x1b[K"); // Xóa dòng hiện tại từ con trỏ đến cuối dòng
    process.exit(); // Thoát khỏi quá trình
  });
}

setInterval(() => {}, 1000); // Để script không kết thúc ngay
