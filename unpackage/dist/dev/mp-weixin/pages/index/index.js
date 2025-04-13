"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      storyContent: "",
      analysisResult: "",
      loading: false
    };
  },
  onLoad() {
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      const isLoggedIn = this.$store.state.isLoggedIn;
      if (!isLoggedIn) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录",
          confirmText: "去登录",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/auth/login"
              });
            }
          }
        });
      }
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    async analyzeStory() {
      if (!this.storyContent.trim()) {
        common_vendor.index.showToast({
          title: "请输入故事内容",
          icon: "none"
        });
        return;
      }
      this.loading = true;
      try {
        const response = await common_vendor.index.request({
          url: "https://open.hunyuan.tencent.com/openapi/v1/agent/chat/completions",
          method: "POST",
          header: {
            "X-Source": "openapi",
            "Content-Type": "application/json",
            "Authorization": "Bearer hDzFpYB0b0qKBYjY5S7PUHMcoR8vCT4t"
          },
          data: {
            assistant_id: "wxZhHLAo8R9b",
            user_id: "user_" + Date.now(),
            stream: false,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `请分析以下情感故事，并给出对男女主角的建议：
                    
${this.storyContent}

请从以下几个方面进行分析：
1. 故事中的主要问题
2. 男女主角的行为分析
3. 建议的改进方案
4. 情感关系的建议`
                  }
                ]
              }
            ]
          }
        });
        if (response.statusCode === 200) {
          const result = response.data.choices[0].message.content;
          this.analysisResult = result;
        } else {
          throw new Error("分析失败");
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "分析失败，请稍后重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_assets._imports_1,
    c: common_vendor.o(($event) => $options.navigateTo("/pages/chat/chat-mentor")),
    d: common_assets._imports_2,
    e: common_vendor.o(($event) => $options.navigateTo("/pages/analyze/analyze")),
    f: common_assets._imports_3,
    g: common_vendor.o(($event) => $options.navigateTo("/pages/profile/optimize")),
    h: common_assets._imports_4,
    i: common_vendor.o(($event) => $options.navigateTo("/pages/stories/stories"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
