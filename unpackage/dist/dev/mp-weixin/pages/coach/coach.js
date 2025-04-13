"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      chatContent: null,
      analysis: {
        emotion: "积极向上",
        stage: "暧昧期",
        problems: "沟通频率不够，话题深度不足",
        suggestions: "建议增加日常交流，分享更多生活细节"
      }
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    chooseFile() {
      this.chatContent = [
        {
          time: "10:00",
          content: "早安呀，今天天气真好",
          isSelf: true
        },
        {
          time: "10:01",
          content: "是啊，很适合出去走走",
          isSelf: false
        }
      ];
    },
    reupload() {
      this.chatContent = null;
    },
    saveAnalysis() {
      common_vendor.index.showToast({
        title: "分析结果已保存",
        icon: "success"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: !$data.chatContent
  }, !$data.chatContent ? {
    c: common_assets._imports_0$4,
    d: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args))
  } : {
    e: common_vendor.f($data.chatContent, (item, index, i0) => {
      return {
        a: common_vendor.t(item.time),
        b: common_vendor.t(item.content),
        c: common_vendor.n(item.isSelf ? "self" : "other"),
        d: index
      };
    }),
    f: common_vendor.t($data.analysis.emotion),
    g: common_vendor.t($data.analysis.stage),
    h: common_vendor.t($data.analysis.problems),
    i: common_vendor.t($data.analysis.suggestions)
  }, {
    j: $data.chatContent
  }, $data.chatContent ? {
    k: common_vendor.o((...args) => $options.reupload && $options.reupload(...args)),
    l: common_vendor.o((...args) => $options.saveAnalysis && $options.saveAnalysis(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/coach/coach.js.map
