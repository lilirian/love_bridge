"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      storyContent: "",
      analysisResult: "",
      loading: false
    };
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
    },
    async chooseFile() {
      try {
        const res = await common_vendor.index.chooseFile({
          count: 1,
          type: "file",
          extension: [".txt", ".md"]
        });
        if (res.tempFiles && res.tempFiles.length > 0) {
          const file = res.tempFiles[0];
          if (file.size > 1024 * 1024) {
            common_vendor.index.showToast({
              title: "文件大小不能超过1MB",
              icon: "none"
            });
            return;
          }
          this.loading = true;
          const content = await this.readFileContent(file);
          this.storyContent = content.slice(0, 1e3);
          this.loading = false;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/stories/stories.vue:173", "选择文件失败:", error);
        common_vendor.index.showToast({
          title: "选择文件失败",
          icon: "none"
        });
      }
    },
    readFileContent(file) {
      return new Promise((resolve, reject) => {
        common_vendor.index.getFileSystemManager().readFile({
          filePath: file.path,
          encoding: "utf8",
          success: (res) => {
            resolve(res.data);
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args)),
    c: $data.storyContent,
    d: common_vendor.o(($event) => $data.storyContent = $event.detail.value),
    e: common_vendor.t($data.storyContent.length),
    f: !$data.loading
  }, !$data.loading ? {} : {}, {
    g: common_vendor.o((...args) => $options.analyzeStory && $options.analyzeStory(...args)),
    h: !$data.storyContent.trim() || $data.loading,
    i: $data.loading ? 1 : "",
    j: $data.analysisResult
  }, $data.analysisResult ? {
    k: common_vendor.t($data.analysisResult)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/stories/stories.js.map
