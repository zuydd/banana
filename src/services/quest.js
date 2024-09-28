import colors from "colors";
import delayHelper from "../helpers/delay.js";

class QuestService {
  constructor() {}

  async getQuestList(user) {
    try {
      const { data } = await user.http.get(
        "get_quest_list/v2?page_num=1&page_size=50"
      );
      if (data.code === 0) {
        const dataResponse = data.data;
        const skipQuestList = user?.database?.skipErrorTasks || [
          1, 2, 11, 35, 31, 82, 77, 56, 57, 81, 101, 102, 106,
        ];
        const quests = dataResponse.list.filter(
          (quest) =>
            !skipQuestList.includes(quest.quest_id) &&
            (!quest.is_achieved || !quest.is_claimed)
        );
        const progressQuest = dataResponse.progress.split("/")[0] || 0;
        return {
          quests,
          progress: progressQuest,
        };
      } else {
        throw new Error(`Lấy danh sách quest thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return {
        quests: [],
        progress: 0,
      };
    }
  }

  async handleQuest(user, quests, progress) {
    if (quests.length > 0) {
      user.log.log(
        `Số nhiệm vụ chưa hoàn thành: ${colors.green(quests.length)}`
      );
    }

    if (progress >= 3) {
      const countClaim = Math.floor(progress / 3);
      for (let index = 0; index < countClaim; index++) {
        await this.claimQuestLottery(user);
      }
    }
    for (const quest of quests) {
      const statusAchieve = await this.achieveQuest(user, quest);
      if (!statusAchieve) continue;
      const statusClaim = await this.claimQuest(user, quest);
      if (!statusClaim) continue;
      progress++;
      if (progress === 3) {
        await this.claimQuestLottery(user);
      }
    }
  }

  async achieveQuest(user, quest) {
    const body = {
      quest_id: quest.quest_id,
    };
    try {
      const { data } = await user.http.post("achieve_quest", body);
      if (data.code === 0) {
        user.log.log(
          `Làm nhiệm vụ ${colors.blue(
            quest.quest_name
          )} thành công, chờ 3s để claim....`
        );
        await delayHelper.delay(3);
        return true;
      } else {
        throw new Error(
          `Làm nhiệm vụ ${colors.white(
            `[${quest.quest_id}] ${quest.quest_name}`
          )} thất bại: ${data.msg}`
        );
      }
    } catch (error) {
      user.log.logError(error.message);
      return false;
    }
  }

  async claimQuest(user, quest) {
    const body = {
      quest_id: quest.quest_id,
    };
    try {
      const { data } = await user.http.post("claim_quest", body);
      if (data.code === 0) {
        user.log.log(
          `Nhận thưởng nhiệm vụ ${colors.blue(
            quest.quest_name
          )} thành công, phần thưởng: ${colors.yellow(data.data.peel)} 🍌`
        );
        return true;
      } else {
        throw new Error(
          `Nhận thưởng nhiệm vụ [${quest.quest_id}] ${quest.quest_name} thất bại: ${data.msg}`
        );
      }
    } catch (error) {
      user.log.logError(error.message);
      return false;
    }
  }

  async claimQuestLottery(user) {
    const body = {};
    try {
      const { data } = await user.http.post("claim_quest_lottery", body);
      if (data.code === 0) {
        user.log.log(
          colors.green(`Đã hoàn thành 3 nhiệm vụ, nhận thêm một lượt harvest`)
        );
        return true;
      } else {
        throw new Error(`Nhận thêm harvest thất bại: ${data.msg}`);
      }
    } catch (error) {
      user.log.logError(error.message);
      return false;
    }
  }
}

const questService = new QuestService();
export default questService;
