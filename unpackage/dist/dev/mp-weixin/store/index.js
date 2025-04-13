"use strict";
const common_vendor = require("../common/vendor.js");
const getInitialState = () => {
  const token = common_vendor.index.getStorageSync("access_token");
  const userInfo = common_vendor.index.getStorageSync("user_info");
  const userProfile = common_vendor.index.getStorageSync("user_profile");
  return {
    isLoggedIn: !!token,
    userInfo: userInfo || null,
    userProfile: userProfile || null,
    token: token || null
  };
};
const store = common_vendor.createStore({
  state: getInitialState(),
  mutations: {
    setIsLoggedIn(state, status) {
      state.isLoggedIn = status;
    },
    setUserInfo(state, info) {
      state.userInfo = info;
      common_vendor.index.setStorageSync("user_info", info);
    },
    setUserProfile(state, profile) {
      state.userProfile = profile;
      common_vendor.index.setStorageSync("user_profile", profile);
    },
    setToken(state, token) {
      state.token = token;
      common_vendor.index.setStorageSync("access_token", token);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.userProfile = null;
      state.token = null;
      common_vendor.index.removeStorageSync("access_token");
      common_vendor.index.removeStorageSync("refresh_token");
      common_vendor.index.removeStorageSync("user_info");
      common_vendor.index.removeStorageSync("user_profile");
    }
  },
  actions: {
    async fetchUserProfile({ commit, state }) {
      try {
        const token = common_vendor.index.getStorageSync("access_token");
        if (!token)
          return;
        const response = await common_vendor.index.request({
          url: "http://localhost:8000/api/user/profile/",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        if (response.statusCode === 200) {
          commit("setUserProfile", response.data);
          common_vendor.index.setStorageSync("user_profile", response.data);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at store/index.js:66", "获取用户信息失败:", error);
      }
    }
  },
  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
    currentUser: (state) => state.userInfo,
    userProfile: (state) => state.userProfile
  }
});
exports.store = store;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
