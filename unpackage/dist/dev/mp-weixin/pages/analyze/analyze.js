"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      targetFeatures: "",
      analysisResult: "",
      loading: false
    };
  },
  methods: {
    async analyzeTarget() {
      if (!this.targetFeatures.trim()) {
        common_vendor.index.showToast({
          title: "请输入约会对象特征",
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
                    text: `请根据以下约会对象的特征，分析他们可能希望的另一半类型：

${this.targetFeatures}

请从以下几个方面进行分析：
1. 理想伴侣的性格特点
2. 可能看重的价值观
3. 期望的生活方式
4. 潜在的兴趣爱好匹配
5. 可能存在的潜在问题
6. 相处建议

请给出详细的分析和建议，帮助用户更好地了解如何与这位约会对象相处。`
                  }
                ]
              }
            ]
          }
        });
        if (response.statusCode === 200) {
          this.analysisResult = response.data.choices[0].message.content;
          common_vendor.index.showToast({
            title: "分析成功",
            icon: "success"
          });
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
    },
    copyResult() {
      common_vendor.index.setClipboardData({
        data: this.analysisResult,
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
    a: $data.targetFeatures,
    b: common_vendor.o(($event) => $data.targetFeatures = $event.detail.value),
    c: common_vendor.t($data.targetFeatures.length),
    d: !$data.loading
  }, !$data.loading ? {} : {}, {
    e: common_vendor.o((...args) => $options.analyzeTarget && $options.analyzeTarget(...args)),
    f: $data.loading ? 1 : "",
    g: $data.analysisResult
  }, $data.analysisResult ? {
    h: common_vendor.t($data.analysisResult),
    i: common_vendor.o((...args) => $options.copyResult && $options.copyResult(...args)),
    j: common_vendor.o((...args) => $options.saveResult && $options.saveResult(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/analyze/analyze.js.map
