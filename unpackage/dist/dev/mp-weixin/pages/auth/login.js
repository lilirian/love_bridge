"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      password: "",
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      if (!this.username || !this.password) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      this.loading = true;
      try {
        const response = await common_vendor.index.request({
          url: "http://127.0.0.1:8000/api/user/login/",
          method: "POST",
          header: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          data: {
            username: this.username,
            password: this.password
          }
        });
        if (response.statusCode === 200) {
          const { access, refresh, user } = response.data;
          common_vendor.index.setStorageSync("access_token", access);
          common_vendor.index.setStorageSync("refresh_token", refresh);
          common_vendor.index.setStorageSync("user_info", user);
          this.$store.commit("setUserInfo", user);
          this.$store.commit("setIsLoggedIn", true);
          this.$store.commit("setToken", access);
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          const pages = getCurrentPages();
          const prevPage = pages[pages.length - 2];
          if (prevPage) {
            common_vendor.index.navigateBack();
          } else {
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
          }
        } else {
          let errorMsg = "登录失败";
          if (response.data.detail) {
            errorMsg = response.data.detail;
          } else if (response.data.error) {
            errorMsg = response.data.error;
          }
          common_vendor.index.showToast({
            title: errorMsg,
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/auth/login.vue:122", "登录错误:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    goToRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/auth/register"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.username,
    b: common_vendor.o(($event) => $data.username = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: common_vendor.t($data.loading ? "登录中..." : "登录"),
    f: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    g: $data.loading,
    h: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/auth/login.js.map
