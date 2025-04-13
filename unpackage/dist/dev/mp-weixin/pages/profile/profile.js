"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        nickname: "",
        gender: "M",
        birth_date: "",
        location: "",
        bio: "",
        interests: "",
        avatar_url: ""
      },
      genderOptions: ["男", "女"],
      genderIndex: 0
    };
  },
  onLoad() {
    this.getUserProfile();
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 获取用户资料
    async getUserProfile() {
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
        const res = await common_vendor.index.request({
          url: "http://localhost:8000/api/user/profile/",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.statusCode === 200) {
          this.userInfo = res.data;
          this.genderIndex = this.userInfo.gender === "M" ? 0 : 1;
        } else if (res.statusCode === 401) {
          common_vendor.index.removeStorageSync("access_token");
          common_vendor.index.showToast({
            title: "登录已过期，请重新登录",
            icon: "none"
          });
          common_vendor.index.navigateTo({
            url: "/pages/auth/login"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取资料失败",
          icon: "none"
        });
      }
    },
    // 选择头像
    async chooseAvatar() {
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
        const res = await common_vendor.index.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"]
        });
        if (res.tempFilePaths.length > 0) {
          const uploadRes = await common_vendor.index.uploadFile({
            url: "http://localhost:8000/api/user/users/upload_avatar/",
            filePath: res.tempFilePaths[0],
            name: "avatar",
            header: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (uploadRes.statusCode === 200) {
            let data;
            try {
              data = JSON.parse(uploadRes.data);
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/profile/profile.vue:169", "解析返回数据失败:", e);
              data = uploadRes.data;
            }
            if (data.avatar_url) {
              this.userInfo.avatar_url = data.avatar_url;
            } else if (data.avatar) {
              this.userInfo.avatar_url = data.avatar;
            }
            await this.getUserProfile();
            common_vendor.index.showToast({
              title: "头像上传成功",
              icon: "success"
            });
          } else if (uploadRes.statusCode === 401) {
            common_vendor.index.removeStorageSync("access_token");
            common_vendor.index.showToast({
              title: "登录已过期，请重新登录",
              icon: "none"
            });
            common_vendor.index.navigateTo({
              url: "/pages/auth/login"
            });
          } else {
            common_vendor.index.__f__("error", "at pages/profile/profile.vue:197", "上传失败:", uploadRes);
            common_vendor.index.showToast({
              title: "上传失败",
              icon: "none"
            });
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:205", "上传出错:", error);
        common_vendor.index.showToast({
          title: "上传失败",
          icon: "none"
        });
      }
    },
    // 性别选择
    onGenderChange(e) {
      this.genderIndex = e.detail.value;
      this.userInfo.gender = this.genderIndex === 0 ? "M" : "F";
    },
    // 出生日期选择
    onBirthDateChange(e) {
      this.userInfo.birth_date = e.detail.value;
    },
    // 保存资料
    async saveProfile() {
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
      if (!this.userInfo.nickname) {
        common_vendor.index.showToast({
          title: "请输入昵称",
          icon: "none"
        });
        return;
      }
      if (!this.userInfo.birth_date) {
        common_vendor.index.showToast({
          title: "请选择出生日期",
          icon: "none"
        });
        return;
      }
      const postData = {
        nickname: this.userInfo.nickname,
        gender: this.userInfo.gender,
        birth_date: this.userInfo.birth_date,
        location: this.userInfo.location || "",
        bio: this.userInfo.bio || "",
        interests: this.userInfo.interests || ""
      };
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:266", "准备发送的数据:", postData);
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:267", "当前用户信息:", this.userInfo);
      try {
        common_vendor.index.__f__("log", "at pages/profile/profile.vue:270", "开始发送请求...");
        const res = await common_vendor.index.request({
          url: "http://localhost:8000/api/user/profile/update/",
          method: "POST",
          data: postData,
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        common_vendor.index.__f__("log", "at pages/profile/profile.vue:281", "请求响应:", res);
        if (res.statusCode === 200) {
          common_vendor.index.__f__("log", "at pages/profile/profile.vue:284", "保存成功，重新获取用户资料...");
          await this.getUserProfile();
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
        } else if (res.statusCode === 401) {
          common_vendor.index.__f__("log", "at pages/profile/profile.vue:292", "token 无效或过期");
          common_vendor.index.removeStorageSync("access_token");
          common_vendor.index.showToast({
            title: "登录已过期，请重新登录",
            icon: "none"
          });
          common_vendor.index.navigateTo({
            url: "/pages/auth/login"
          });
        } else {
          common_vendor.index.__f__("log", "at pages/profile/profile.vue:303", "保存失败，错误信息:", res.data);
          let errorMsg = "保存失败";
          if (res.data && res.data.detail) {
            errorMsg = res.data.detail;
          } else if (res.data && res.data.message) {
            errorMsg = res.data.message;
          } else if (res.data && typeof res.data === "string") {
            errorMsg = res.data;
          }
          common_vendor.index.showToast({
            title: errorMsg,
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:319", "保存出错:", error);
        common_vendor.index.showToast({
          title: "保存失败，请检查网络",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.userInfo.avatar_url || "/static/images/default-avatar.png",
    c: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args)),
    d: $data.userInfo.nickname,
    e: common_vendor.o(($event) => $data.userInfo.nickname = $event.detail.value),
    f: common_vendor.t($data.genderOptions[$data.genderIndex]),
    g: $data.genderOptions,
    h: $data.genderIndex,
    i: common_vendor.o((...args) => $options.onGenderChange && $options.onGenderChange(...args)),
    j: common_vendor.t($data.userInfo.birth_date || "请选择出生日期"),
    k: $data.userInfo.birth_date,
    l: common_vendor.o((...args) => $options.onBirthDateChange && $options.onBirthDateChange(...args)),
    m: $data.userInfo.location,
    n: common_vendor.o(($event) => $data.userInfo.location = $event.detail.value),
    o: $data.userInfo.bio,
    p: common_vendor.o(($event) => $data.userInfo.bio = $event.detail.value),
    q: $data.userInfo.interests,
    r: common_vendor.o(($event) => $data.userInfo.interests = $event.detail.value),
    s: common_vendor.o((...args) => $options.saveProfile && $options.saveProfile(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
