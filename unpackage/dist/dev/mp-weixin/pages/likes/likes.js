"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      likesList: []
    };
  },
  onLoad() {
    this.getLikesList();
  },
  methods: {
    goBack() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack({
          delta: 1
        });
      } else {
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      }
    },
    async getLikesList() {
      try {
        const localLikes = common_vendor.index.getStorageSync("likes_list");
        if (localLikes) {
          this.likesList = localLikes;
        }
        const token = common_vendor.index.getStorageSync("access_token");
        if (!token) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          common_vendor.index.navigateTo({
            url: "/pages/auth/login"
          });
          return;
        }
        const response = await common_vendor.index.request({
          url: "http://127.0.0.1:8000/match/likes/",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (response.statusCode === 200) {
          this.likesList = response.data;
          common_vendor.index.setStorageSync("likes_list", response.data);
        } else if (response.statusCode === 401) {
          await this.refreshToken();
          await this.getLikesList();
        } else {
          common_vendor.index.__f__("log", "at pages/likes/likes.vue:102", "获取喜欢列表失败，使用本地数据");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/likes/likes.vue:105", "获取喜欢列表失败:", error);
        common_vendor.index.__f__("log", "at pages/likes/likes.vue:106", "使用本地存储的数据");
      }
    },
    async refreshToken() {
      try {
        const refreshToken = common_vendor.index.getStorageSync("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }
        const response = await common_vendor.index.request({
          url: "http://127.0.0.1:8000/api/user/token/refresh/",
          method: "POST",
          header: {
            "Content-Type": "application/json"
          },
          data: {
            refresh: refreshToken
          }
        });
        if (response.statusCode === 200) {
          const { access } = response.data;
          common_vendor.index.setStorageSync("access_token", access);
          return true;
        }
        return false;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/likes/likes.vue:134", "刷新token失败:", error);
        return false;
      }
    },
    handleChat(user) {
      common_vendor.index.navigateTo({
        url: `/pages/chat-detail/chat-detail?id=${user.id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.likesList.length === 0
  }, $data.likesList.length === 0 ? {
    c: common_assets._imports_0$5
  } : {
    d: common_vendor.f($data.likesList, (item, index, i0) => {
      return common_vendor.e({
        a: item.avatar_url || "/static/images/default-avatar.png",
        b: common_vendor.t(item.nickname || item.username),
        c: common_vendor.t(item.age),
        d: common_vendor.t(item.location || "未知"),
        e: item.interests
      }, item.interests ? {
        f: common_vendor.f(item.interests.split(","), (interest, i, i1) => {
          return {
            a: common_vendor.t(interest),
            b: i
          };
        })
      } : {}, {
        g: common_vendor.o(($event) => $options.handleChat(item), index),
        h: index
      });
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/likes/likes.js.map
