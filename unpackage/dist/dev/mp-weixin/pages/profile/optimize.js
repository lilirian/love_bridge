"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentProfile: "",
      optimizedProfile: "",
      loading: false
    };
  },
  methods: {
    async optimizeProfile() {
      if (!this.currentProfile.trim()) {
        common_vendor.index.showToast({
          title: "请输入个人资料",
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
            "Authorization": "Bearer YMIX3JyOKlPHvrYJ3xmy2pRwrPCdJSbl"
          },
          data: {
            assistant_id: "P4XEtqPu95io",
            user_id: "user_" + Date.now(),
            stream: false,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `请帮我优化以下个人资料，使其更具吸引力：

${this.currentProfile}

请从以下几个方面进行优化：
1. 语言表达更加生动有趣
2. 突出个人优势和特点
3. 增加情感共鸣点
4. 保持真实性和可信度
5. 结构清晰，重点突出
6. 增加互动性和话题性

请给出优化后的完整个人资料。`
                  }
                ]
              }
            ]
          }
        });
        if (response.statusCode === 200) {
          this.optimizedProfile = response.data.choices[0].message.content;
          common_vendor.index.showToast({
            title: "优化成功",
            icon: "success"
          });
        } else {
          throw new Error("优化失败");
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "优化失败，请稍后重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    copyResult() {
      common_vendor.index.setClipboardData({
        data: this.optimizedProfile,
        success: () => {
          common_vendor.index.showToast({
            title: "复制成功",
            icon: "success"
          });
        }
      });
    },
    saveResult() {
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentProfile,
    b: common_vendor.o(($event) => $data.currentProfile = $event.detail.value),
    c: common_vendor.t($data.currentProfile.length),
    d: !$data.loading
  }, !$data.loading ? {} : {}, {
    e: common_vendor.o((...args) => $options.optimizeProfile && $options.optimizeProfile(...args)),
    f: $data.loading ? 1 : "",
    g: $data.optimizedProfile
  }, $data.optimizedProfile ? {
    h: common_vendor.t($data.optimizedProfile),
    i: common_vendor.o((...args) => $options.copyResult && $options.copyResult(...args)),
    j: common_vendor.o((...args) => $options.saveResult && $options.saveResult(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/optimize.js.map
