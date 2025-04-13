"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "my",
  setup(__props) {
    const store = common_vendor.useStore();
    common_vendor.ref(0);
    const isLoggedIn = common_vendor.computed(() => store.state.isLoggedIn);
    const userInfo = common_vendor.computed(() => store.state.userInfo);
    const userProfile = common_vendor.computed(() => store.state.userProfile);
    const userAvatar = common_vendor.computed(() => {
      var _a, _b;
      if ((_b = (_a = userProfile.value) == null ? void 0 : _a.data) == null ? void 0 : _b.avatar_url) {
        if (userProfile.value.data.avatar_url.startsWith("http")) {
          return userProfile.value.data.avatar_url;
        }
        return "http://localhost:8000" + userProfile.value.data.avatar_url;
      }
      return "/static/images/default-avatar.png";
    });
    const changeAvatar = async () => {
      if (!isLoggedIn.value) {
        common_vendor.index.navigateTo({
          url: "/pages/auth/login"
        });
        return;
      }
      try {
        const res = await common_vendor.index.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"]
        });
        if (res.tempFilePaths.length > 0) {
          const token = common_vendor.index.getStorageSync("access_token");
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
              common_vendor.index.__f__("error", "at pages/my/my.vue:141", "解析返回数据失败:", e);
              data = uploadRes.data;
            }
            await store.dispatch("fetchUserProfile");
            common_vendor.index.showToast({
              title: "头像上传成功",
              icon: "success"
            });
          } else {
            throw new Error("上传失败");
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my.vue:156", "上传出错:", error);
        common_vendor.index.showToast({
          title: "上传失败",
          icon: "none"
        });
      }
    };
    const goToProfile = () => {
      if (!isLoggedIn.value) {
        common_vendor.index.navigateTo({
          url: "/pages/auth/login"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/profile/profile"
      });
    };
    const goToSettings = () => {
      common_vendor.index.navigateTo({
        url: "/pages/settings/settings"
      });
    };
    const goToLikes = () => {
      if (!isLoggedIn.value) {
        common_vendor.index.navigateTo({
          url: "/pages/auth/login"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/likes/likes"
      });
    };
    const goToMatches = () => {
      if (!isLoggedIn.value) {
        common_vendor.index.navigateTo({
          url: "/pages/auth/login"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/matches/matches"
      });
    };
    const goToHelp = () => {
      common_vendor.index.navigateTo({
        url: "/pages/help/help"
      });
    };
    const handleLogout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            store.commit("logout");
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
            common_vendor.index.navigateTo({
              url: "/pages/auth/login"
            });
          }
        }
      });
    };
    common_vendor.onMounted(async () => {
      if (isLoggedIn.value) {
        try {
          await store.dispatch("fetchUserProfile");
          common_vendor.index.__f__("log", "at pages/my/my.vue:237", "用户信息:", userProfile.value);
          common_vendor.index.__f__("log", "at pages/my/my.vue:238", "头像URL:", userAvatar.value);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/my/my.vue:240", "获取用户信息失败:", error);
          common_vendor.index.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
        }
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/auth/login"
        });
      }
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: userAvatar.value,
        b: isLoggedIn.value ? 1 : "",
        c: common_vendor.o(changeAvatar),
        d: common_vendor.t(((_a = userInfo.value) == null ? void 0 : _a.username) || "未登录"),
        e: common_vendor.t(((_b = userInfo.value) == null ? void 0 : _b.email) || "请登录"),
        f: isLoggedIn.value
      }, isLoggedIn.value ? {} : {}, {
        g: common_vendor.o(goToProfile),
        h: common_vendor.o(goToSettings),
        i: common_vendor.o(goToLikes),
        j: common_vendor.o(goToMatches),
        k: common_vendor.o(goToHelp),
        l: isLoggedIn.value
      }, isLoggedIn.value ? {
        m: common_vendor.o(handleLogout)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
