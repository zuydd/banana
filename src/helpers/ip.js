class IPClass {
  constructor() {}

  getIP(proxy) {
    if (proxy === "" || proxy === "skip") {
      return "local";
    }
    let ip = proxy.split("@")[1];
    ip = ip.split(":")[0];
    return ip;
  }

  isIpActive(proxy, ips) {
    const ip = this.getIP(proxy);
    const active = ips.includes(ip);
    return {
      ip,
      active,
    };
  }
}

const ipClass = new IPClass();
export default ipClass;
