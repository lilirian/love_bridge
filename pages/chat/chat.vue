<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <text class="title">AI畅聊</text>
        <text class="subtitle">选择你喜欢的AI助手吧~</text>
      </view>
    </view>

    <!-- 智能体选择区域 -->
    <view class="agent-grid">
      <view class="agent-card" v-for="(agent, index) in agents" :key="index" @tap="selectAgent(agent)">
        <image class="agent-avatar" :src="agent.avatar" mode="aspectFill"></image>
        <text class="agent-name">{{agent.name}}</text>
        <text class="agent-desc">{{agent.description}}</text>
      </view>
    </view>

    <!-- 聊天区域 -->
    <scroll-view class="chat-container" scroll-y="true" :scroll-top="scrollTop" v-if="selectedAgent">
      <view class="chat-list">
        <view class="chat-item ai" v-for="(item, index) in chatList" :key="index" v-if="item.type === 'ai'">
          <image class="avatar" :src="selectedAgent.avatar" mode="aspectFill"></image>
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
    <view class="input-area" v-if="selectedAgent">
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
      agents: [
        {
          id: 'y7z63lZRYE5F',
          name: '蔺昭',
          description: '温柔体贴的男性角色',
          avatar: '/static/images/agent1.png',
          token: 'baUp0tGq6VOCyrAnXz16VsjqRRL3iyVX'
        },
        {
          id: 'eXEaQYguME2Q',
          name: '沐阳',
          description: '阳光开朗的男性角色',
          avatar: '/static/images/agent2.png',
          token: 'o0EYdiKCfCZ5KZ0hrFG028rXoV96rTAH'
        },
        {
          id: 'E2ZKO8dpJPLU',
          name: '夏曜',
          description: '成熟稳重的男性角色',
          avatar: '/static/images/agent3.png',
          token: 'QqvOBvuemNgPsu3zeRBKiJYP9MV5O0Cy'
        },
        {
          id: 'lxiWRNpk2G9r',
          name: '女友',
          description: '温柔可爱的女性角色',
          avatar: '/static/images/agent4.png',
          token: 'TnojdeD0jHPQLUCsUM6DR50FEuYWb15R'
        },
        {
          id: 'hAmlYgLLrPSZ',
          name: '邻家姐姐',
          description: '知性优雅的女性角色',
          avatar: '/static/images/agent5.png',
          token: 'Y4GQWxz3wRpBWsudXa1bVidNSFa4NyWu'
        },
        {
          id: 'rz4vDYMIGXQW',
          name: '邻家妹妹',
          description: '活泼可爱的女性角色',
          avatar: '/static/images/agent6.png',
          token: 'XtW9cxsuZoMKmkOZFltz0YS4ZHLSNBfM'
        }
      ],
      selectedAgent: null,
      chatList: [],
      inputMessage: '',
      scrollTop: 0
    }
  },
  methods: {
    selectAgent(agent) {
      // 跳转到聊天详情页面
      uni.navigateTo({
        url: `/pages/chat/chat-detail?agent=${encodeURIComponent(JSON.stringify(agent))}`
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
        // 构建消息历史
        const messages = this.chatList.map(item => ({
          role: item.type === 'user' ? 'user' : 'assistant',
          content: [{
            type: 'text',
            text: item.content
          }]
        }))
        
        const response = await uni.request({
          url: 'https://open.hunyuan.tencent.com/openapi/v1/agent/chat/completions',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.selectedAgent.token}`
          },
          data: {
            assistant_id: this.selectedAgent.id,
            user_id: 'user_' + Date.now(),
            messages: messages
          }
        })
        
        console.log('API响应:', response)
        
        if (response.data && response.data.choices && response.data.choices[0]) {
          const aiResponse = response.data.choices[0].message.content[0].text
          this.chatList.push({
            type: 'ai',
            content: aiResponse
          })
          this.scrollToBottom()
        } else {
          console.error('API响应格式错误:', response)
          this.chatList.push({
            type: 'ai',
            content: '抱歉，我遇到了一些问题，请稍后再试。'
          })
          this.scrollToBottom()
        }
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
  border-radius: 0 0 20rpx 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #0288d1;
  margin-bottom: 6rpx;
}

.subtitle {
  font-size: 24rpx;
  color: #666;
}

.agent-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx;
}

.agent-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
}

.agent-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-bottom: 10rpx;
}

.agent-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.agent-desc {
  font-size: 22rpx;
  color: #666;
  text-align: center;
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