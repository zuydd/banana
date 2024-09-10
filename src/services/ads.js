import colors from "colors";

class AdsClass {
  constructor() {}

  async viewAds(user, type) {
    const body = { type };
    try {
      const { data } = await user.http.post("claim_ads_income", body);
      if (data.code === 0) {
        const reward = data.data;
        const peels = `Peels: ${reward.peels} 🍌`;
        const income = `USDT: ${reward.income} 💵`;
        const speedup = `Speedup: ${reward.speedup} 🚀`;
        let textReward = colors.yellow(peels);
        if (reward.income) {
          textReward += ` - ${colors.green(income)}`;
        }
        if (reward.speedup) {
          textReward += ` - ${colors.green(speedup)}`;
        }
        user.log.log(`Xem quảng cáo thành công, phần thưởng: ${textReward}`);
        return reward;
      } else {
        throw new Error(`Xem quảng cáo thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return null;
    }
  }
}

const adsClass = new AdsClass();
export default adsClass;
