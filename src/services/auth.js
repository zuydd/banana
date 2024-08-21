import colors from "colors";
import bananaHelper from "../helpers/banana.js";
import fileHelper from "../helpers/file.js";

class AuthService {
  constructor() {}

  async login(user, isRetry = false, skipLog = false) {
    if (isRetry && !skipLog) {
      user.log.log("Token hết hạn, đang lấy lại token........");
    } else if (!skipLog) {
      console.log(
        `========== Đăng nhập tài khoản ${user.index} | ${user.info.fullName.green} ==========`
      );
    }

    let token = fileHelper.getTokenById(user.info.id);

    if (!token || isRetry) {
      const body = {
        tgInfo: user.query_id,
        InviteCode: "UHMFCK6",
      };
      try {
        const { data } = await user.http.post("login", body);
        if (data.code === 0) {
          token = data.data.token;
        } else {
          throw new Error(`Đăng nhập thất bại: ${data.msg}`);
        }
      } catch (error) {
        user.log.logError(error.message);
        return false;
      }
    }
    user.http.updateToken(token);
    fileHelper.saveToken(user.info.id, token);
    return true;
  }

  async getUserInfo(user, skipRetry = false) {
    try {
      const { data } = await user.http.get("get_user_info");
      if (data.code === 0) {
        const info = data.data;
        const equip_banana = info.equip_banana;
        const peels = `Peels: ${info.peel} 🍌`;
        const usdt = `USDT: ${info.usdt} 💵`;
        const bananaInfo = bananaHelper.getInfo(equip_banana);

        user.log.log(`${colors.yellow(peels)} - ${colors.green(usdt)}`);
        user.log.log(`Chuối đang dùng: ${bananaInfo}`);
        // console.log(info);
        return info;
      } else {
        throw new Error(`Lấy dữ liệu thất bại: ${data.msg}`);
      }
    } catch (error) {
      if (skipRetry) {
        user.log.logError(error.message);
        return false;
      } else {
        fileHelper.saveToken(user.info.id, null);
        const statusLogin = await this.login(user, true);
        if (!statusLogin) return false;
        return await this.getUserInfo(user, true);
      }
    }
  }

  async getBananaEquipInfo(user) {
    try {
      const { data } = await user.http.get("get_user_info");
      if (data.code === 0) {
        return data.data.equip_banana;
      } else {
        throw new Error(`Lấy dữ liệu thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;
