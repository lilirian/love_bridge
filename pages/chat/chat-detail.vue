<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="nav-title">
        <text>{{selectedAgent?.name || '聊天'}}</text>
      </view>
    </view>

    <!-- 聊天区域 -->
    <scroll-view class="chat-container" scroll-y="true" :scroll-top="scrollTop">
      <view class="chat-list">
        <template v-for="(item, index) in chatList" :key="index">
          <view class="chat-item ai" v-if="item.type === 'ai'">
            <image class="avatar" :src="selectedAgent?.avatar" mode="aspectFill"></image>
            <view class="message">
              <text>{{item.content}}</text>
            </view>
          </view>
          <view class="chat-item user" v-else-if="item.type === 'user'">
            <view class="message">
              <text>{{item.content}}</text>
            </view>
            <image class="avatar" src="/static/images/user-avatar.png" mode="aspectFill"></image>
          </view>
        </template>
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
      selectedAgent: null,
      chatList: [],
      inputMessage: '',
      scrollTop: 0
    }
  },
  onLoad(options) {
    // 从路由参数中获取选中的智能体信息
    if (options.agent) {
      try {
        this.selectedAgent = JSON.parse(decodeURIComponent(options.agent))
        this.chatList = [{
          type: 'ai',
          content: `你好！我是${this.selectedAgent.name}，${this.selectedAgent.description}，有什么我可以帮你的吗？`
        }]
      } catch (error) {
        console.error('解析智能体信息失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: (err) => {
          console.error('返回失败:', err)
          // 如果返回失败，尝试使用其他方式返回
          uni.switchTab({
            url: '/pages/chat/chat'
          })
        }
      })
    },
    async sendMessage() {
      if (!this.inputMessage.trim() || !this.selectedAgent) return
      
      // 添加用户消息
      this.chatList.push({
        type: 'user',
        content: this.inputMessage
      })
      
      const userMessage = this.inputMessage
      this.inputMessage = ''
      this.scrollToBottom()
      
      try {
        // 构建消息历史，确保第一条是用户消息
        const messages = this.chatList.map((item, index) => {
          // 如果是第一条消息且不是用户消息，则跳过
          if (index === 0 && item.type !== 'user') {
            return null
          }
          return {
            role: item.type === 'user' ? 'user' : 'assistant',
            content: [{
              type: 'text',
              text: item.content
            }]
          }
        }).filter(Boolean) // 过滤掉null值
        
        const requestData = {
          assistant_id: this.selectedAgent.id,
          user_id: 'user_' + Date.now(),
          messages: messages,
          stream: false,
          chat_type: 'published'
        }
        
        console.log('发送的消息:', requestData)
        
        const response = await uni.request({
          url: 'https://open.hunyuan.tencent.com/openapi/v1/agent/chat/completions',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.selectedAgent.token}`,
            'Accept': 'application/json'
          },
          data: requestData
        })
        
        console.log('API响应:', response)
        
        if (response.statusCode === 200 && response.data) {
          console.log('API响应数据:', response.data)
          if (response.data.choices && response.data.choices[0]) {
            const choice = response.data.choices[0]
            console.log('AI回复内容:', choice)
            if (choice.message && choice.message.content) {
              // 直接使用content字符串，因为API返回的是字符串而不是数组
              const aiResponse = choice.message.content
              console.log('解析后的AI回复:', aiResponse)
              this.chatList.push({
                type: 'ai',
                content: aiResponse
              })
              this.scrollToBottom()
            } else {
              console.error('消息内容格式错误:', choice.message)
              this.chatList.push({
                type: 'ai',
                content: '抱歉，我遇到了一些问题，请稍后再试。'
              })
            }
          } else {
            console.error('choices格式错误:', response.data.choices)
            this.chatList.push({
              type: 'ai',
              content: '抱歉，我遇到了一些问题，请稍后再试。'
            })
          }
        } else {
          console.error('API响应错误:', response)
          if (response.data && response.data.error) {
            console.error('API错误信息:', response.data.error)
          }
          this.chatList.push({
            type: 'ai',
            content: '抱歉，我遇到了一些问题，请稍后再试。'
          })
        }
        this.scrollToBottom()
      } catch (error) {
        console.error('API调用失败:', error)
        this.chatList.push({
          type: 'ai',
          content: '抱歉，我遇到了一些问题，请稍后再试。'
        })
        this.scrollToBottom()
      }
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
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx;
  color: #0288d1;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.chat-container {
  flex: 1;
  padding: 20rpx;
  margin-bottom: 120rpx;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
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
  padding: 16rpx 24rpx;
  border-radius: 20rpx;
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