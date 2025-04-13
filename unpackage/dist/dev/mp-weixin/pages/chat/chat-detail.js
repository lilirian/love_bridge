"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      selectedAgent: null,
      chatList: [],
      inputMessage: "",
      scrollTop: 0
    };
  },
  onLoad(options) {
    if (options.agent) {
      try {
        this.selectedAgent = JSON.parse(decodeURIComponent(options.agent));
        this.chatList = [{
          type: "ai",
          content: `你好！我是${this.selectedAgent.name}，${this.selectedAgent.description}，有什么我可以帮你的吗？`
        }];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chat/chat-detail.vue:63", "解析智能体信息失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      }
    }
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack({
        delta: 1,
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/chat/chat-detail.vue:76", "返回失败:", err);
          common_vendor.index.switchTab({
            url: "/pages/chat/chat"
          });
        }
      });
    },
    async sendMessage() {
      if (!this.inputMessage.trim() || !this.selectedAgent)
        return;
      this.chatList.push({
        type: "user",
        content: this.inputMessage
      });
      this.inputMessage;
      this.inputMessage = "";
      this.scrollToBottom();
      try {
        const messages = this.chatList.map((item, index) => {
          if (index === 0 && item.type !== "user") {
            return null;
          }
          return {
            role: item.type === "user" ? "user" : "assistant",
            content: [{
              type: "text",
              text: item.content
            }]
          };
        }).filter(Boolean);
        const requestData = {
          assistant_id: this.selectedAgent.id,
          user_id: "user_" + Date.now(),
          messages,
          stream: false,
          chat_type: "published"
        };
        common_vendor.index.__f__("log", "at pages/chat/chat-detail.vue:121", "发送的消息:", requestData);
        const response = await common_vendor.index.request({
          url: "https://open.hunyuan.tencent.com/openapi/v1/agent/chat/completions",
          method: "POST",
          header: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.selectedAgent.token}`,
            "Accept": "application/json"
          },
          data: requestData
        });
        common_vendor.index.__f__("log", "at pages/chat/chat-detail.vue:134", "API响应:", response);
        if (response.statusCode === 200 && response.data) {
          common_vendor.index.__f__("log", "at pages/chat/chat-detail.vue:137", "API响应数据:", response.data);
          if (response.data.choices && response.data.choices[0]) {
            const choice = response.data.choices[0];
            common_vendor.index.__f__("log", "at pages/chat/chat-detail.vue:140", "AI回复内容:", choice);
            if (choice.message && choice.message.content) {
              const aiResponse = choice.message.content;
              common_vendor.index.__f__("log", "at pages/chat/chat-detail.vue:144", "解析后的AI回复:", aiResponse);
              this.chatList.push({
                type: "ai",
                content: aiResponse
              });
              this.scrollToBottom();
            } else {
              common_vendor.index.__f__("error", "at pages/chat/chat-detail.vue:151", "消息内容格式错误:", choice.message);
              this.chatList.push({
                type: "ai",
                content: "抱歉，我遇到了一些问题，请稍后再试。"
              });
            }
          } else {
            common_vendor.index.__f__("error", "at pages/chat/chat-detail.vue:158", "choices格式错误:", response.data.choices);
            this.chatList.push({
              type: "ai",
              content: "抱歉，我遇到了一些问题，请稍后再试。"
            });
          }
        } else {
          common_vendor.index.__f__("error", "at pages/chat/chat-detail.vue:165", "API响应错误:", response);
          if (response.data && response.data.error) {
            common_vendor.index.__f__("error", "at pages/chat/chat-detail.vue:167", "API错误信息:", response.data.error);
          }
          this.chatList.push({
            type: "ai",
            content: "抱歉，我遇到了一些问题，请稍后再试。"
          });
        }
        this.scrollToBottom();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chat/chat-detail.vue:176", "API调用失败:", error);
        this.chatList.push({
          type: "ai",
          content: "抱歉，我遇到了一些问题，请稍后再试。"
        });
        this.scrollToBottom();
      }
    },
    scrollToBottom() {
      setTimeout(() => {
        this.scrollTop = 9999999;
      }, 100);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t(((_a = $data.selectedAgent) == null ? void 0 : _a.name) || "聊天"),
    c: common_vendor.f($data.chatList, (item, index, i0) => {
      var _a2;
      return common_vendor.e({
        a: item.type === "ai"
      }, item.type === "ai" ? {
        b: (_a2 = $data.selectedAgent) == null ? void 0 : _a2.avatar,
        c: common_vendor.t(item.content)
      } : item.type === "user" ? {
        e: common_vendor.t(item.content),
        f: common_assets._imports_0$1
      } : {}, {
        d: item.type === "user",
        g: index
      });
    }),
    d: $data.scrollTop,
    e: $data.inputMessage,
    f: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    g: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat-detail.js.map
