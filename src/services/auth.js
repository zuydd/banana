import colors from "colors";
import bananaHelper from "../helpers/banana.js";
import fileHelper from "../helpers/file.js";

class AuthService {
  constructor() {}

  async login(user) {
    user.http.updateToken(null);
    const body = {
      tgInfo: user.query_id,
      InviteCode: user?.database?.ref,
    };
    try {
      const { data } = await user.http.post("login", body);
      if (data.code === 0) {
        return {
          access: data.data.token,
        };
      } else {
        throw new Error(`Đăng nhập thất bại: ${data.msg}`);
      }
    } catch (error) {
      if (error.message.includes("429")) {
        user.log.logError(`IP đang bị chặn vui lòng thử lại sau 8-12 giờ`);
        return 429;
      } else {
        user.log.logError(error.message);
        return null;
      }
    }
  }

  async getProfile(user) {
    try {
      const { data } = await user.http.get("get_user_info");
      if (data.code === 0) {
        const info = data.data;
        return info;
      } else {
        throw new Error(`Lấy dữ liệu thất bại: ${data.msg}`);
      }
    } catch (error) {
      if (error.message.includes("429")) {
        user.log.logError(`IP đang bị chặn vui lòng thử lại sau 8-12 giờ`);
        return 429;
      } else {
        user.log.logError(`Lấy thông tin tài khoản thất bại: ${error.message}`);
        return null;
      }
    }
  }

  async handleLogin(user, showLog = true) {
    if (showLog) {
      console.log(
        `========== Đăng nhập tài khoản ${user.index} | ${user.info.fullName.green} ==========`
      );
    }

    let token = fileHelper.getTokenById(user.info.id);

    if (token) {
      const info = {
        access: token,
      };
      const profile = await this.handleAfterLogin(user, info, showLog);
      return {
        status: 1,
        profile,
      };
    }

    let infoLogin = await this.login(user);
    if (infoLogin === 429) {
      return {
        status: 0,
        profile: 429,
      };
    }
    if (infoLogin) {
      const profile = await this.handleAfterLogin(user, infoLogin, showLog);
      return {
        status: 1,
        profile,
      };
    }
    user.log.logError(
      "Quá trình đăng nhập thất bại, vui lòng kiểm tra lại thông tin tài khoản (có thể cần phải lấy mới query_id). Hệ thống sẽ thử đăng nhập lại sau 60s"
    );
    return {
      status: 0,
      profile: null,
    };
  }

  async handleAfterLogin(user, info, showLog = true) {
    const accessToken = info.access || null;
    user.http.updateToken(accessToken);
    fileHelper.saveToken(user.info.id, accessToken);
    const profile = await this.getProfile(user);
    if (profile === 429) {
      return 429;
    }
    if (profile) {
      const equip_banana = profile?.equip_banana;
      user.banana_info = equip_banana;
      const peels = `Peels: ${profile?.peel} 🍌`;
      const usdt = `USDT: ${profile?.usdt} 💵`;
      const bananaInfo = bananaHelper.getInfo(equip_banana);

      if (showLog) {
        user.log.log(`${colors.yellow(peels)} - ${colors.green(usdt)}`);
        user.log.log(`Chuối đang dùng: ${bananaInfo}`);
      }
    }
    return profile;
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
