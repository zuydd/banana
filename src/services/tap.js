import colors from "colors";

import dayjs from "dayjs";
import delayHelper from "../helpers/delay.js";
import generatorHelper from "../helpers/generator.js";
import lotteryService from "./lottery.js";

class TapService {
  constructor() {}

  async tap(user, restTapCount) {
    let tapCount = generatorHelper.randomInt(8, 15);
    if (tapCount > restTapCount) tapCount = restTapCount;
    const body = {
      clickCount: tapCount,
    };
    try {
      const { data } = await user.http.post("do_click", body);
      if (data.code === 0) {
        const dataResponse = data.data;
        return dataResponse;
      } else {
        throw new Error(`Tap ${tapCount} lần thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return null;
    }
  }

  async speedup(user) {
    const body = {};
    try {
      const { data } = await user.http.post("do_speedup", body);
      if (data.code === 0) {
        const dataResponse = data.data;
        return dataResponse;
      } else {
        throw new Error(`Speedup thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return null;
    }
  }

  async handleTap(user, maxTapCount, todayTapCount, oldSpeedUp) {
    const totalTap = maxTapCount - todayTapCount;
    let count = 0;
    let claimSpeedUp = 0;
    if (todayTapCount < maxTapCount) {
      user.log.log(colors.yellow(`Bắt đầu tap......`));
      while (todayTapCount < maxTapCount && count < 100) {
        const restTapCount = maxTapCount - todayTapCount;
        const tapResponse = await this.tap(user, restTapCount);
        if (!tapResponse) return;
        if (tapResponse.speedup > 0) claimSpeedUp++;
        todayTapCount += tapResponse.peel;
        await delayHelper.delay(0.2);
        count++;
      }
      user.log.log(
        `Đã tap xong ${colors.green(totalTap)} lần, nhận được ${colors.green(
          claimSpeedUp
        )} speedup`
      );
    } else {
      user.log.log(colors.magenta(`Đã tap hết số lượt của hôm nay`));
    }

    return oldSpeedUp + claimSpeedUp;
  }

  async handleSpeedUp(user, speedupCount) {
    const lotteryInfo = await lotteryService.getLotteryInfo(user);
    if (!lotteryInfo) return 60;
    let lastCountdown = lotteryInfo.last_countdown_start_time;
    let diffTime = dayjs().diff(dayjs(lastCountdown), "minute");
    let numberOfSpeedup = 0;
    while (speedupCount > 0 && diffTime < 290) {
      const speedupInfo = await this.speedup(user);
      if (speedupInfo) {
        const { speedup_count, lottery_info } = speedupInfo;
        speedupCount = speedup_count;
        lastCountdown = lottery_info.last_countdown_start_time;
        diffTime = dayjs().diff(dayjs(lastCountdown), "minute");
        numberOfSpeedup++;
      }
    }
    const ressTime = 480 - diffTime;
    user.log.log(
      `Đã speedup ${colors.green(
        numberOfSpeedup + " lần"
      )}, cần chờ ${colors.magenta(
        ressTime + " phút"
      )} trước khi claim lần mới.....`
    );
    return ressTime;
  }
}

const tapService = new TapService();
export default tapService;
