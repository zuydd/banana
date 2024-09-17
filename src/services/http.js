import axios from "axios";
import dayjs from "dayjs";
import { HttpsProxyAgent } from "https-proxy-agent";
import UserAgent from "user-agents";
import delayHelper from "../helpers/delay.js";

export class HttpService {
  constructor(log, delay, proxy = null) {
    this.baseURL = "https://interface.carv.io/banana/";
    this.proxy = proxy;
    this.log = log;
    this.token = null;
    this.delay = delay;
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "Sec-Fetch-Site": "same-site",
      "Accept-Language": "vi-VN,vi;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Sec-Fetch-Mode": "cors",
      Host: "interface.carv.io",
      Origin: "https://banana.carv.io",
      "User-Agent": new UserAgent({ deviceCategory: "mobile" }),
      Referer: "https://banana.carv.io/",
      Connection: "keep-alive",
      "Sec-Fetch-Dest": "empty",
      "X-App-ID": "carv",
    };
  }

  updateToken(token) {
    this.token = token;
  }

  initConfig() {
    const headers = {
      ...this.headers,
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    headers["request-time"] = dayjs().unix() * 100;
    const config = {
      headers,
    };
    if (this.proxy && this.proxy !== "skip") {
      config["httpsAgent"] = new HttpsProxyAgent(this.proxy);
    }
    return config;
  }

  async get(endPoint) {
    const url = this.baseURL + endPoint;
    const config = this.initConfig();
    await delayHelper.delay(this.delay);
    return axios.get(url, config);
  }

  async post(endPoint, body) {
    const url = this.baseURL + endPoint;
    const config = this.initConfig();
    await delayHelper.delay(this.delay);

    return axios.post(url, body, config);
  }

  async checkProxyIP() {
    if (!this.proxy || this.proxy === "skip") {
      this.log.updateIp("🖥️");
      return null;
    }
    try {
      const proxyAgent = new HttpsProxyAgent(this.proxy);
      const response = await axios.get("https://api.ipify.org?format=json", {
        httpsAgent: proxyAgent,
      });
      if (response.status === 200) {
        const ip = response.data.ip;
        this.log.updateIp(ip);
        return ip;
      } else {
        throw new Error("Proxy lỗi, kiểm tra lại kết nối proxy");
      }
    } catch (error) {
      this.log.updateIp("🖥️");
      this.log.logError("Proxy lỗi, kiểm tra lại kết nối proxy");
      return -1;
    }
  }
}
