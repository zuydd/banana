import colors from "colors";

class BananaHelper {
  constructor() {}

  getRarityRank(banana) {
    let rank = "";
    switch (banana.ripeness) {
      case "Unripe":
        rank = colors.grey.bold("★☆☆☆☆");
        break;
      case "Ripe":
        rank = colors.grey.bold("★★☆☆☆");
        break;
      case "Fully Ripe":
        rank = colors.yellow.bold("★★★☆☆");
        break;
      case "Overripe":
        if (banana.sell_exchange_usdt < 1) {
          rank = colors.red.bold("★★★★☆");
        } else {
          rank = colors.red("★★★★★");
        }
        break;

      default:
        break;
    }
    return rank;
  }

  getInfo(banana) {
    const rank = this.getRarityRank(banana);
    const sellPeel = colors.yellow(`${banana.sell_exchange_peel} 🍌`);
    const sellUsdt = colors.green(`${banana.sell_exchange_usdt} 💵`);
    const info = `${banana.name} [${
      banana.banana_id
    }] ${rank} Sản lượng: ${colors.yellow(
      banana.daily_peel_limit
    )} 🍌/ngày - Giá bán: ${sellPeel} + ${sellUsdt}`;
    return info;
  }
}

const bananaHelper = new BananaHelper();
export default bananaHelper;
