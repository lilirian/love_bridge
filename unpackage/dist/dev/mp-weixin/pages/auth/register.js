"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      gender: "M",
      genderIndex: 0,
      genderOptions: ["男", "女"],
      birthDate: "",
      bio: "",
      loading: false
    };
  },
  methods: {
    handleGenderChange(e) {
      this.genderIndex = e.detail.value;
      this.gender = this.genderIndex === 0 ? "M" : "F";
    },
    handleBirthDateChange(e) {
      this.birthDate = e.detail.value;
    },
    async handleRegister() {
      if (!this.username || !this.email || !this.password || !this.birthDate) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      this.loading = true;
      try {
        const response = await common_vendor.index.request({
          url: "http://127.0.0.1:8000/api/user/register/",
          method: "POST",
          header: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          data: {
            username: this.username,
            email: this.email,
            password: this.password,
            gender: this.gender,
            birth_date: this.birthDate,
            bio: this.bio || ""
          }
        });
        if (response.statusCode === 201) {
          common_vendor.index.setStorageSync("access_token", response.data.tokens.access);
          common_vendor.index.setStorageSync("refresh_token", response.data.tokens.refresh);
          common_vendor.index.setStorageSync("user_info", response.data.user);
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success"
          });
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        } else {
          let errorMsg = "注册失败";
          if (response.data.username) {
            errorMsg = response.data.username[0];
          } else if (response.data.email) {
            errorMsg = response.data.email[0];
          } else if (response.data.password) {
            errorMsg = response.data.password[0];
          } else if (response.data.detail) {
            errorMsg = response.data.detail;
          }
          common_vendor.index.showToast({
            title: errorMsg,
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
    goToLogin() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.username,
    b: common_vendor.o(($event) => $data.username = $event.detail.value),
    c: $data.email,
    d: common_vendor.o(($event) => $data.email = $event.detail.value),
    e: $data.password,
    f: common_vendor.o(($event) => $data.password = $event.detail.value),
    g: common_vendor.t($data.genderOptions[$data.genderIndex]),
    h: $data.genderOptions,
    i: $data.genderIndex,
    j: common_vendor.o((...args) => $options.handleGenderChange && $options.handleGenderChange(...args)),
    k: common_vendor.t($data.birthDate || "请选择出生日期"),
    l: $data.birthDate,
    m: common_vendor.o((...args) => $options.handleBirthDateChange && $options.handleBirthDateChange(...args)),
    n: $data.bio,
    o: common_vendor.o(($event) => $data.bio = $event.detail.value),
    p: common_vendor.t($data.loading ? "注册中..." : "注册"),
    q: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    r: $data.loading,
    s: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/auth/register.js.map
