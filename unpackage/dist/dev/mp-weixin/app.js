"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/auth/login.js";
  "./pages/auth/register.js";
  "./pages/index/index.js";
  "./pages/profile/optimize.js";
  "./pages/chat/chat.js";
  "./pages/chat/chat-detail.js";
  "./pages/match/match.js";
  "./pages/private-chat/private-chat.js";
  "./pages/my/my.js";
  "./pages/profile/profile.js";
  "./pages/chat-detail/chat-detail.js";
  "./pages/coach/coach.js";
  "./pages/analyze/analyze.js";
  "./pages/stories/stories.js";
  "./pages/likes/likes.js";
  "./pages/chat/chat-mentor.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:6", "App Launch");
    this.checkLoginStatus();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:11", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:14", "App Hide");
  },
  methods: {
    ...common_vendor.mapMutations(["setUserInfo", "setIsLoggedIn", "logout", "setToken"]),
    checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("access_token");
      const userInfo = common_vendor.index.getStorageSync("user_info");
      if (token && userInfo) {
        this.$store.commit("setUserInfo", userInfo);
        this.$store.commit("setIsLoggedIn", true);
        this.$store.commit("setToken", token);
      } else {
        this.$store.commit("setIsLoggedIn", false);
        this.$store.commit("setUserInfo", null);
        this.$store.commit("setToken", null);
      }
    },
    async validateToken(token) {
      try {
        common_vendor.index.__f__("log", "at App.vue:36", "开始验证token");
        const response = await common_vendor.index.request({
          url: "http://localhost:8000/api/user/profile/",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          timeout: 5e3,
          withCredentials: true
        });
        common_vendor.index.__f__("log", "at App.vue:49", "token验证响应状态码:", response.statusCode);
        if (response.statusCode === 200) {
          common_vendor.index.__f__("log", "at App.vue:52", "token验证成功");
          this.setUserInfo(response.data);
          return true;
        } else if (response.statusCode === 401) {
          common_vendor.index.__f__("log", "at App.vue:57", "token已过期，尝试刷新");
          return await this.refreshToken();
        } else {
          common_vendor.index.__f__("log", "at App.vue:61", "token验证失败，状态码:", response.statusCode);
          this.clearLoginState();
          return false;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:67", "验证token失败:", error);
        return false;
      }
    },
    async refreshToken() {
      try {
        common_vendor.index.__f__("log", "at App.vue:74", "开始刷新token");
        const refreshToken = common_vendor.index.getStorageSync("refresh_token");
        if (!refreshToken) {
          common_vendor.index.__f__("log", "at App.vue:77", "未找到refresh_token");
          this.clearLoginState();
          return false;
        }
        const response = await common_vendor.index.request({
          url: "http://localhost:8000/api/user/token/refresh/",
          method: "POST",
          header: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          data: {
            refresh: refreshToken
          },
          withCredentials: true
        });
        common_vendor.index.__f__("log", "at App.vue:95", "token刷新响应状态码:", response.statusCode);
        if (response.statusCode === 200) {
          common_vendor.index.__f__("log", "at App.vue:98", "token刷新成功");
          const newToken = response.data.access;
          this.setToken(newToken);
          common_vendor.index.setStorageSync("access_token", newToken);
          return true;
        } else {
          common_vendor.index.__f__("log", "at App.vue:105", "token刷新失败，状态码:", response.statusCode);
          this.clearLoginState();
          return false;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:110", "刷新token失败:", error);
        this.clearLoginState();
        return false;
      }
    },
    clearLoginState() {
      common_vendor.index.__f__("log", "at App.vue:116", "清除登录状态");
      this.logout();
      common_vendor.index.removeStorageSync("access_token");
      common_vendor.index.removeStorageSync("refresh_token");
      common_vendor.index.removeStorageSync("user_info");
      common_vendor.index.removeStorageSync("user_profile");
      common_vendor.index.__f__("log", "at App.vue:122", "登录状态已清除");
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
