"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      agents: [
        {
          id: "y7z63lZRYE5F",
          name: "蔺昭",
          description: "温柔体贴的男性角色",
          avatar: "/static/images/agent1.png",
          token: "baUp0tGq6VOCyrAnXz16VsjqRRL3iyVX"
        },
        {
          id: "eXEaQYguME2Q",
          name: "沐阳",
          description: "阳光开朗的男性角色",
          avatar: "/static/images/agent2.png",
          token: "o0EYdiKCfCZ5KZ0hrFG028rXoV96rTAH"
        },
        {
          id: "E2ZKO8dpJPLU",
          name: "夏曜",
          description: "成熟稳重的男性角色",
          avatar: "/static/images/agent3.png",
          token: "QqvOBvuemNgPsu3zeRBKiJYP9MV5O0Cy"
        },
        {
          id: "lxiWRNpk2G9r",
          name: "女友",
          description: "温柔可爱的女性角色",
          avatar: "/static/images/agent4.png",
          token: "TnojdeD0jHPQLUCsUM6DR50FEuYWb15R"
        },
        {
          id: "hAmlYgLLrPSZ",
          name: "邻家姐姐",
          description: "知性优雅的女性角色",
          avatar: "/static/images/agent5.png",
          token: "Y4GQWxz3wRpBWsudXa1bVidNSFa4NyWu"
        },
        {
          id: "rz4vDYMIGXQW",
          name: "邻家妹妹",
          description: "活泼可爱的女性角色",
          avatar: "/static/images/agent6.png",
          token: "XtW9cxsuZoMKmkOZFltz0YS4ZHLSNBfM"
        }
      ],
      selectedAgent: null,
      chatList: [],
      inputMessage: "",
      scrollTop: 0
    };
  },
  methods: {
    selectAgent(agent) {
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat-detail?agent=${encodeURIComponent(JSON.stringify(agent))}`
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
        const messages = this.chatList.map((item) => ({
          role: item.type === "user" ? "user" : "assistant",
          content: [{
            type: "text",
            text: item.content
          }]
        }));
        const response = await common_vendor.index.request({
          url: "https://open.hunyuan.tencent.com/openapi/v1/agent/chat/completions",
          method: "POST",
          header: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.selectedAgent.token}`
          },
          data: {
            assistant_id: this.selectedAgent.id,
            user_id: "user_" + Date.now(),
            messages
          }
        });
        common_vendor.index.__f__("log", "at pages/chat/chat.vue:146", "API响应:", response);
        if (response.data && response.data.choices && response.data.choices[0]) {
          const aiResponse = response.data.choices[0].message.content[0].text;
          this.chatList.push({
            type: "ai",
            content: aiResponse
          });
          this.scrollToBottom();
        } else {
          common_vendor.index.__f__("error", "at pages/chat/chat.vue:156", "API响应格式错误:", response);
          this.chatList.push({
            type: "ai",
            content: "抱歉，我遇到了一些问题，请稍后再试。"
          });
          this.scrollToBottom();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chat/chat.vue:164", "API调用失败:", error);
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
  return common_vendor.e({
    a: common_vendor.f($data.agents, (agent, index, i0) => {
      return {
        a: agent.avatar,
        b: common_vendor.t(agent.name),
        c: common_vendor.t(agent.description),
        d: index,
        e: common_vendor.o(($event) => $options.selectAgent(agent), index)
      };
    }),
    b: $data.selectedAgent
  }, $data.selectedAgent ? common_vendor.e({
    c: _ctx.item.type === "ai"
  }, _ctx.item.type === "ai" ? {
    d: common_vendor.f($data.chatList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.content),
        b: index
      };
    }),
    e: $data.selectedAgent.avatar
  } : {}, {
    f: _ctx.item.type === "user"
  }, _ctx.item.type === "user" ? {
    g: common_vendor.f($data.chatList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.content),
        b: index
      };
    }),
    h: common_assets._imports_0$1
  } : {}, {
    i: $data.scrollTop
  }) : {}, {
    j: $data.selectedAgent
  }, $data.selectedAgent ? {
    k: $data.inputMessage,
    l: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    m: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
