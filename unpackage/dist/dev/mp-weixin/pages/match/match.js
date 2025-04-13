"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      matchList: [],
      loading: false,
      currentIndex: 0
    };
  },
  onLoad() {
    this.getRecommendations();
  },
  methods: {
    handleSwiperChange(e) {
      this.currentIndex = e.detail.current;
    },
    async getRecommendations() {
      this.loading = true;
      try {
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
          url: "http://127.0.0.1:8000/api/user/match/recommendations/",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (response.statusCode === 200) {
          this.matchList = response.data;
        } else if (response.statusCode === 401) {
          await this.refreshToken();
          await this.getRecommendations();
        } else {
          common_vendor.index.showToast({
            title: "获取推荐用户失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
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
        common_vendor.index.__f__("error", "at pages/match/match.vue:132", "刷新token失败:", error);
        return false;
      }
    },
    async handleLike(index) {
      const user = this.matchList[index];
      if (!user || !user.id) {
        common_vendor.index.showToast({
          title: "用户信息不完整",
          icon: "none"
        });
        return;
      }
      try {
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
          url: "http://127.0.0.1:8000/api/user/match/like/",
          method: "POST",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            to_user: user.id
          }
        });
        if (response.statusCode === 201) {
          const likesResponse = await common_vendor.index.request({
            url: "http://127.0.0.1:8000/api/user/match/likes/",
            method: "GET",
            header: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (likesResponse.statusCode === 200) {
            common_vendor.index.setStorageSync("likes_list", likesResponse.data);
          }
          common_vendor.index.showToast({
            title: "喜欢成功",
            icon: "success"
          });
          this.matchList.splice(index, 1);
        } else {
          common_vendor.index.showToast({
            title: response.data.error || "操作失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/match/match.vue:200", "点赞失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      }
    },
    handleDislike(index) {
      this.matchList.splice(index, 1);
      common_vendor.index.showToast({
        title: "已跳过",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.matchList, (item, index, i0) => {
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
        g: common_vendor.t(item.bio || "这个人很懒，什么都没写~"),
        h: common_vendor.o(($event) => $options.handleDislike(index), index),
        i: common_vendor.o(($event) => $options.handleLike(index), index),
        j: $data.currentIndex === index ? 1 : "",
        k: index
      });
    }),
    b: common_vendor.o((...args) => $options.handleSwiperChange && $options.handleSwiperChange(...args)),
    c: $data.loading
  }, $data.loading ? {} : {}, {
    d: !$data.loading && $data.matchList.length === 0
  }, !$data.loading && $data.matchList.length === 0 ? {
    e: common_assets._imports_0$2
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map
