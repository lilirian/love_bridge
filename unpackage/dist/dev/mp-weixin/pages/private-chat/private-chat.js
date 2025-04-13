"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      chatList: []
    };
  },
  methods: {
    enterChat(item) {
      common_vendor.index.navigateTo({
        url: `/pages/chat-detail/chat-detail?id=${item.id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.chatList.length === 0
  }, $data.chatList.length === 0 ? {
    b: common_assets._imports_0$3
  } : {
    c: common_vendor.f($data.chatList, (item, index, i0) => {
      return {
        a: item.avatar,
        b: common_vendor.t(item.username),
        c: common_vendor.t(item.lastMessage),
        d: common_vendor.t(item.time),
        e: index,
        f: common_vendor.o(($event) => $options.enterChat(item), index)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/private-chat/private-chat.js.map
