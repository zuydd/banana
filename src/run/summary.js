import colors from "colors";
import readline from "readline";
import bananaHelper from "../helpers/banana.js";
import authService from "../services/auth.js";
import bananaService from "../services/banana.js";
import userService from "../services/user.js";

const PRICE_MIN = 0.05;
let progress = 0;
let lockLog = false;

const run = async (user) => {
  progress++;
  const ip = await user.http.checkProxyIP();
  if (ip === -1) {
    user.log.logError("Proxy lỗi, kiểm tra lại kết nối proxy");
    return;
  }
  const statusLogin = await authService.login(user, false, true);
  if (!statusLogin) return;
  let bananas = await bananaService.getBananaList(user);
  bananas = bananas.filter((banana) => banana.sell_exchange_usdt >= PRICE_MIN);
  if (!bananas.length) return;
  lockLog = true;
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  console.log(
    colors.white(
      `======== Tài khoản ${colors.blue(user.index)} _ ID: ${colors.blue(
        user.info.id
      )} _ Name: ${colors.blue(user.info.fullName)} ========`
    )
  );
  for (const banana of bananas) {
    const bananaInfo = bananaHelper.getInfo(banana);
    console.log(colors.green("x" + banana.count) + " chuối " + bananaInfo);
  }

  lockLog = false;
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
  `Cập nhật các tool mới nhất tại: ${colors.gray("https://github.com/zuydd")}`
);
console.log("");
console.log("");
console.log("");
console.log(
  `Thống kê tài khoản có giá trị chuối cao hơn hoặc bằng ${colors.green(
    PRICE_MIN + " USDT"
  )} .....`
);

const users = await userService.loadUser();

const time = setInterval(() => {
  if (!lockLog) {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(
      `Tiến độ thống kê: ${colors.magenta(progress + "/" + users.length)}`
    );
  }

  if (progress >= users.length) {
    clearInterval(time);
  }
}, 100);

for (const [index, user] of users.entries()) {
  await run(user);
}
