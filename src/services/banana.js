// import colors from "colors";
// import bananaHelper from "../helpers/banana.js";
import colors from "colors";
import inquirer from "inquirer";
import bananaHelper from "../helpers/banana.js";
import delayHelper from "../helpers/delay.js";

export class BananaService {
  constructor() {}

  async getBananaList(user) {
    try {
      const { data } = await user.http.get("get_banana_list");
      if (data.code === 0) {
        const dataResponse = data.data;
        let bananas = dataResponse.banana_list.filter(
          (banana) => banana.count > 0
        );
        bananas = bananas.sort((a, b) => {
          // So sánh theo daily_peel_limit trước
          if (b.daily_peel_limit !== a.daily_peel_limit) {
            return b.daily_peel_limit - a.daily_peel_limit;
          }
          // Nếu daily_peel_limit bằng nhau, so sánh theo sell_exchange_usdt
          if (b.sell_exchange_usdt !== a.sell_exchange_usdt) {
            return b.sell_exchange_usdt - a.sell_exchange_usdt;
          }
          // Nếu cả daily_peel_limit và sell_exchange_usdt bằng nhau, so sánh theo sell_exchange_peel
          return b.sell_exchange_peel - a.sell_exchange_peel;
        });
        return bananas;
      } else {
        throw new Error(`Lấy danh sách chuối thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return [];
    }
  }

  async equip(user, id) {
    const body = {
      bananaId: id,
    };
    try {
      const { data } = await user.http.post("do_equip", body);
      if (data.code === 0) {
        return true;
      } else {
        throw new Error(`Đổi chuối thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return false;
    }
  }

  async handleEquip(user, currentBananaId) {
    const bananas = await this.getBananaList(user);
    if (!bananas.length) return;
    if (currentBananaId !== bananas[0].banana_id) {
      const statusEquip = await this.equip(user, bananas[0].banana_id);
      if (statusEquip) {
        const bananaInfo = bananaHelper.getInfo(bananas[0]);
        user.log.log(`Đổi chuối xịn hơn: ${bananaInfo}`);
      }
    }
  }

  async sell(user, bananaId, sellCount) {
    const body = {
      bananaId,
      sellCount,
    };
    try {
      await delayHelper.delay(2);
      const { data } = await user.http.post("do_sell", body);
      if (data.code === 0) {
        const dataResponse = data.data;
        return dataResponse;
      } else {
        throw new Error(`Bán chuối thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return null;
    }
  }

  async selectModeSell() {
    const items = [
      { name: "Bán tất cả", value: 1 },
      { name: "Bán chuối không có USDT", value: 2 },
      { name: "Bán chuối có USDT", value: 3 },
      { name: "Bán chuối loại Unripe - [Chuối có giá trị thấp]", value: 4 },
      { name: "Bán chuối loại Ripe - [Chuối có giá trị trung bình]", value: 5 },
      { name: "Bán chuối loại Fully Ripe - [Chuối có giá trị khá]", value: 6 },
      { name: "Bán chuối loại Overripe - [Chuối có giá trị cao]", value: 7 },
    ];
    try {
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "selectedItem",
          message: "Chọn một loại danh sách chuối muốn bán:",
          choices: items,
        },
      ]);
      return answers.selectedItem;
    } catch (error) {
      if (error.isTtyError) {
        console.error(
          "Không thể hiển thị giao diện trong môi trường hiện tại."
        );
      } else {
        console.error("Đã xảy ra lỗi:", error);
      }
      return -1;
    }
  }

  filterModeBananaList(mode, bananas, currentBanana) {
    const indexCurrent = bananas.findIndex(
      (banana) => banana.banana_id === currentBanana.banana_id
    );
    if (indexCurrent !== -1) {
      bananas[indexCurrent].count = bananas[indexCurrent].count - 1;
    }

    let result = [];
    switch (mode) {
      case 1:
        result = bananas;
        break;
      case 2:
        result = bananas.filter((banana) => banana.sell_exchange_usdt === 0);
        break;
      case 3:
        result = bananas.filter((banana) => banana.sell_exchange_usdt > 0);
        break;
      case 4:
        result = bananas.filter((banana) => banana.ripeness === "Unripe");
        break;
      case 5:
        result = bananas.filter((banana) => banana.ripeness === "Ripe");
        break;
      case 6:
        result = bananas.filter((banana) => banana.ripeness === "Fully Ripe");
        break;
      case 7:
        result = bananas.filter((banana) => banana.ripeness === "Overripe");
        break;

      default:
        break;
    }
    return result;
  }

  async handleSell(user, mode, bananas, currentBanana) {
    const bananaSellList = this.filterModeBananaList(
      mode,
      bananas,
      currentBanana
    );
    const sellGot = {
      usdt: 0,
      peel: 0,
    };
    let countBanana = 0;
    for (const banana of bananaSellList) {
      user.log.log(
        `Đang bán chuối, đã bán xong: ${colors.yellow(
          countBanana + "/" + bananaSellList.length
        )}`
      );
      if (banana.count === 0) continue;
      if (banana.banana_id === 1) continue;
      const data = await this.sell(user, banana.banana_id, banana.count);
      if (data) {
        countBanana += banana.count;
        sellGot.usdt += data.sell_got_usdt;
        sellGot.peel += data.sell_got_peel;
      }
    }
    if (countBanana === 0) {
      user.log.logError(`Không có chuối để bán`);
    } else {
      const sellPeel = colors.yellow(`${sellGot.peel} 🍌`);
      const sellUsdt = colors.green(`${sellGot.usdt} USDT 💵`);
      user.log.log(
        `Bán ${colors.yellow(countBanana)} quả chuối được: ${
          sellPeel + " và " + sellUsdt
        }`
      );
    }
  }
}

const bananaService = new BananaService();
export default bananaService;
