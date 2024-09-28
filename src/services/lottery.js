import colors from "colors";
import dayjs from "dayjs";
import bananaHelper from "../helpers/banana.js";
import fileHelper from "../helpers/file.js";
import adsClass from "./ads.js";
import bananaService from "./banana.js";

export class LotteryService {
  constructor() {
    this.remainLotteryCount = 0;
  }

  async getLotteryInfo(user) {
    try {
      const { data } = await user.http.get("get_lottery_info");
      if (data.code === 0) {
        return data.data;
      } else {
        throw new Error(`Lấy thông tin lottery thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return null;
    }
  }

  async claimLottery(user) {
    const body = {
      claimLotteryType: 1,
    };
    try {
      const { data } = await user.http.post("claim_lottery", body);
      if (data.code === 0) {
        user.log.log(
          colors.green(`Claim lottery thành công, nhận thêm một lượt harvest`)
        );
        return true;
      } else {
        throw new Error(`Claim lottery thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return false;
    }
  }

  async harvest(user) {
    const body = {};
    try {
      const { data } = await user.http.post("do_lottery", body);
      if (data.code === 0) {
        const dataResponse = data.data?.banana_info;
        const bananaInfo = bananaHelper.getInfo(dataResponse);
        user.log.log(`Harvest thành công, nhận được chuối: ${bananaInfo}`);
        // Ghi log nếu chuối có giá trị cao
        const PRICE_LOG = 0.05;
        if (dataResponse.sell_exchange_usdt >= PRICE_LOG) {
          const rawInfo = `${dataResponse?.name} [${dataResponse?.banana_id}] Sản lượng: ${dataResponse?.daily_peel_limit} 🍌/ngày - Giá bán: ${dataResponse?.sell_exchange_peel} 🍌 + ${dataResponse?.sell_exchange_usdt} USDT 💵`;
          const dataLog = `[No ${user.index} _ ID: ${
            user.info.id
          } _ Time: ${dayjs().format(
            "YYYY-MM-DDTHH:mm:ssZ[Z]"
          )}] Nhận được chuối xịn: ${rawInfo}`;
          fileHelper.writeLog("log.txt", dataLog);
        }
        // Xem quảng cáo
        await adsClass.viewAds(user, 2);
        // Share chuối
        await this.share(user, dataResponse?.banana_id);
        // Đổi chuối
        await bananaService.handleEquip(user, dataResponse);
        return true;
      } else {
        throw new Error(`Harvest thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return false;
    }
  }

  async share(user, bananaId) {
    const body = {
      banana_id: bananaId,
    };
    try {
      const { data } = await user.http.post("do_share", body);
      if (data.code === 0) {
        const dataResponse = data.data;
        user.log.log(
          `Chia sẻ thành công, phần thưởng: ${colors.yellow(
            dataResponse.peel
          )} 🍌`
        );
        if (dataResponse.lottery === 1) {
          user.log.log(
            `Tiến độ chia sẻ: ${colors.green(
              `${dataResponse.share_progress}/3`
            )} - Nhận thêm một lượt harvest`
          );
          this.remainLotteryCount++;
        } else {
          user.log.log(
            `Tiến độ chia sẻ: ${colors.green(
              `${dataResponse.share_progress}/3`
            )}`
          );
        }
        return true;
      } else {
        throw new Error(`Chia sẻ thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return false;
    }
  }

  async handleLottery(user) {
    const lotteryInfo = await this.getLotteryInfo(user);
    if (!lotteryInfo) return;
    this.remainLotteryCount = lotteryInfo.remain_lottery_count;
    const diffStart = dayjs().diff(
      dayjs(lotteryInfo.last_countdown_start_time),
      "minute"
    );
    if (lotteryInfo.countdown_end || diffStart > 480) {
      const statusClaim = await this.claimLottery(user);
      if (statusClaim) {
        this.remainLotteryCount++;
      }
    }
    user.log.log(
      `Số lượt harvest đang có: ${colors.green(this.remainLotteryCount)}`
    );
    for (let index = 0; index < this.remainLotteryCount; index++) {
      await this.harvest(user);
    }
  }
}

const lotteryService = new LotteryService();
export default lotteryService;
