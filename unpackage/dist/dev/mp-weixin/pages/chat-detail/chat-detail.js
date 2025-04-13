"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      chatInfo: {
        username: "匹配用户",
        avatar: "/static/images/default-avatar.png"
      },
      messageList: [],
      inputMessage: "",
      scrollTop: 0
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    sendMessage() {
      if (!this.inputMessage.trim())
        return;
      const message = {
        content: this.inputMessage,
        time: this.formatTime(/* @__PURE__ */ new Date()),
        isSelf: true,
        avatar: "/static/images/my-avatar.png"
      };
      this.messageList.push(message);
      this.inputMessage = "";
      this.scrollToBottom();
    },
    loadMoreMessages() {
    },
    scrollToBottom() {
      setTimeout(() => {
        this.scrollTop = 9999999;
      }, 100);
    },
    formatTime(date) {
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      return `${hour}:${minute}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.chatInfo.username),
    c: common_vendor.f($data.messageList, (item, index, i0) => {
      return {
        a: item.avatar,
        b: common_vendor.t(item.content),
        c: common_vendor.t(item.time),
        d: index,
        e: common_vendor.n(item.isSelf ? "self" : "other")
      };
    }),
    d: $data.scrollTop,
    e: common_vendor.o((...args) => $options.loadMoreMessages && $options.loadMoreMessages(...args)),
    f: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    g: $data.inputMessage,
    h: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    i: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat-detail/chat-detail.js.map
