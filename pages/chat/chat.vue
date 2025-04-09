<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <text class="title">AI畅聊</text>
        <text class="subtitle">和AI谈谈心吧~</text>
      </view>
    </view>

    <!-- 聊天区域 -->
    <scroll-view class="chat-container" scroll-y="true" :scroll-top="scrollTop">
      <view class="chat-list">
        <view class="chat-item ai" v-for="(item, index) in chatList" :key="index" v-if="item.type === 'ai'">
          <image class="avatar" src="/static/images/ai-avatar.png" mode="aspectFill"></image>
          <view class="message">
            <text>{{item.content}}</text>
          </view>
        </view>
        <view class="chat-item user" v-for="(item, index) in chatList" :key="index" v-if="item.type === 'user'">
          <view class="message">
            <text>{{item.content}}</text>
          </view>
          <image class="avatar" src="/static/images/user-avatar.png" mode="aspectFill"></image>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input class="input" type="text" v-model="inputMessage" placeholder="说点什么吧..." />
      <view class="send-btn" @tap="sendMessage">
        <text>发送</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      chatList: [
        {
          type: 'ai',
          content: '你好呀！我是你的AI恋爱顾问，有什么想聊的吗？'
        }
      ],
      inputMessage: '',
      scrollTop: 0
    }
  },
  methods: {
    sendMessage() {
      if (!this.inputMessage.trim()) return
      
      // 添加用户消息
      this.chatList.push({
        type: 'user',
        content: this.inputMessage
      })
      
      // 模拟AI回复
      setTimeout(() => {
        this.chatList.push({
          type: 'ai',
          content: '我明白你的想法，让我们继续聊下去吧~'
        })
        this.scrollToBottom()
      }, 500)
      
      this.inputMessage = ''
      this.scrollToBottom()
    },
    scrollToBottom() {
      setTimeout(() => {
        this.scrollTop = 9999999
      }, 100)
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%);
  display: flex;
  flex-direction: column;
}

.nav-bar {
  padding: 40rpx 20rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0 0 30rpx 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #0288d1;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
}

.chat-container {
  flex: 1;
  padding: 20rpx;
  margin-bottom: 120rpx;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.chat-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.chat-item.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 4rpx solid #fff;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.message {
  max-width: 70%;
  padding: 20rpx 30rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.ai .message {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border-top-left-radius: 0;
}

.user .message {
  background: #0288d1;
  color: #fff;
  border-top-right-radius: 0;
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.input {
  flex: 1;
  height: 80rpx;
  background: #f5f5f5;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.send-btn {
  background: linear-gradient(45deg, #0288d1, #4fc3f7);
  padding: 20rpx 40rpx;
  border-radius: 40rpx;
  color: white;
  font-size: 28rpx;
}

.send-btn:active {
  transform: scale(0.95);
}
</style> 