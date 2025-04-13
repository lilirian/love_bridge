"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      imageUrl: "",
      imageBase64: "",
      chatText: "",
      analysisResult: "",
      loading: false
    };
  },
  methods: {
    async chooseImage() {
      try {
        const { tapIndex } = await new Promise((resolve, reject) => {
          common_vendor.index.showActionSheet({
            itemList: ["从相册选择", "拍照"],
            success: resolve,
            fail: reject
          });
        });
        const sourceType = tapIndex === 0 ? ["album"] : ["camera"];
        const res = await new Promise((resolve, reject) => {
          common_vendor.index.chooseImage({
            count: 1,
            sizeType: ["compressed"],
            sourceType,
            success: resolve,
            fail: reject
          });
        });
        this.imageUrl = res.tempFilePaths[0];
        const base64 = await this.imageToBase64(res.tempFilePaths[0]);
        this.imageBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
        this.chatText = "";
      } catch (error) {
        if (error.errMsg && !error.errMsg.includes("cancel")) {
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      }
    },
    imageToBase64(filePath) {
      return new Promise((resolve, reject) => {
        common_vendor.index.getFileSystemManager().readFile({
          filePath,
          encoding: "base64",
          success: (res) => {
            resolve(res.data);
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    },
    async analyzeChat() {
      let chatContent = "";
      if (this.imageBase64) {
        try {
          const ocrResponse = await common_vendor.index.request({
            url: "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              access_token: await this.getBaiduToken(),
              image: this.imageBase64
            }
          });
          if (ocrResponse.statusCode === 200 && ocrResponse.data.words_result) {
            chatContent = ocrResponse.data.words_result.map((item) => item.words).join("\n");
          } else {
            throw new Error("OCR识别失败");
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: "图片识别失败",
            icon: "none"
          });
          return;
        }
      } else if (this.chatText.trim()) {
        chatContent = this.chatText;
      } else {
        common_vendor.index.showToast({
          title: "请上传图片或输入聊天内容",
          icon: "none"
        });
        return;
      }
      this.loading = true;
      try {
        const aiResponse = await common_vendor.index.request({
          url: "https://open.hunyuan.tencent.com/openapi/v1/agent/chat/completions",
          method: "POST",
          header: {
            "X-Source": "openapi",
            "Content-Type": "application/json",
            "Authorization": "Bearer WGoAkgDx8SMvP1vrqLitDvOSQCfOylRk"
          },
          data: {
            assistant_id: "XiZKiK5UzdSr",
            user_id: "user_" + Date.now(),
            stream: false,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `请分析以下聊天记录，给出专业的恋爱建议：

${chatContent}

请从以下几个方面进行分析：
1. 聊天氛围和互动方式
2. 双方的情感表达
3. 潜在的问题和矛盾
4. 改进建议
5. 后续发展建议

请给出详细的分析和建议。`
                  }
                ]
              }
            ]
          }
        });
        if (aiResponse.statusCode === 200) {
          this.analysisResult = aiResponse.data.choices[0].message.content;
          common_vendor.index.showToast({
            title: "分析成功",
            icon: "success"
          });
        } else {
          throw new Error("AI分析失败");
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
    async getBaiduToken() {
      try {
        const response = await common_vendor.index.request({
          url: "https://aip.baidubce.com/oauth/2.0/token",
          method: "POST",
          data: {
            grant_type: "client_credentials",
            client_id: "KT1upIDxMSBieftQaPdwXLip",
            client_secret: "Upw2Q4dbdPfCmEXM1blNJk8sdGjI37eu"
          }
        });
        if (response.statusCode === 200) {
          return response.data.access_token;
        } else {
          throw new Error("获取token失败");
        }
      } catch (error) {
        throw error;
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
    a: $data.imageUrl
  }, $data.imageUrl ? {
    b: $data.imageUrl
  } : {}, {
    c: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    d: $data.loading,
    e: $data.chatText,
    f: common_vendor.o(($event) => $data.chatText = $event.detail.value),
    g: !$data.loading
  }, !$data.loading ? {} : {}, {
    h: common_vendor.o((...args) => $options.analyzeChat && $options.analyzeChat(...args)),
    i: $data.loading ? 1 : "",
    j: $data.analysisResult
  }, $data.analysisResult ? {
    k: common_vendor.t($data.analysisResult),
    l: common_vendor.o((...args) => $options.copyResult && $options.copyResult(...args)),
    m: common_vendor.o((...args) => $options.saveResult && $options.saveResult(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat-mentor.js.map
