<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <text class="title">个人资料优化</text>
        <text class="subtitle">让AI帮你打造完美的个人介绍</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 输入区域 -->
      <view class="input-section">
        <text class="section-title">当前个人简介</text>
        <textarea 
          class="input-textarea" 
          v-model="currentProfile" 
          placeholder="请输入您当前的个人简介..."
          :maxlength="500"
        ></textarea>
        <text class="word-count">{{ currentProfile.length }}/500</text>
      </view>

      <!-- 优化按钮 -->
      <view class="optimize-btn" @tap="optimizeProfile" :class="{ 'loading': loading }">
        <text v-if="!loading">一键优化</text>
        <text v-else>优化中...</text>
      </view>

      <!-- 优化结果 -->
      <view class="result-section" v-if="optimizedProfile">
        <text class="section-title">优化后的个人简介</text>
        <view class="result-content">
          <text>{{ optimizedProfile }}</text>
        </view>
        <view class="action-buttons">
          <view class="copy-btn" @tap="copyResult">
            <text>复制结果</text>
          </view>
          <view class="use-btn" @tap="useResult">
            <text>使用此版本</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentProfile: '',
      optimizedProfile: '',
      loading: false
    }
  },
  methods: {
    async optimizeProfile() {
      if (!this.currentProfile.trim()) {
        uni.showToast({
          title: '请输入个人简介',
          icon: 'none'
        })
        return
      }

      this.loading = true
      try {
        const response = await uni.request({
          url: 'https://open.hunyuan.tencent.com/openapi/v1/agent/chat/completions',
          method: 'POST',
          header: {
            'X-Source': 'openapi',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eDJrUI9XpQ64LjgMweTfoYh5DqIXJcAc'
          },
          data: {
            assistant_id: 'nDPb8gDN9hXy',
            user_id: 'user_' + Date.now(),
            stream: false,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `请帮我优化以下个人简介，使其更加吸引人、专业且富有魅力：

${this.currentProfile}

请从以下几个方面进行优化：
1. 语言表达更加生动有趣
2. 突出个人特点和优势
3. 增加适当的细节描述
4. 保持简洁但信息丰富
5. 使用积极正面的语言

请直接返回优化后的个人简介，不需要其他解释。`
                  }
                ]
              }
            ]
          }
        })
        
        if (response.statusCode === 200) {
          this.optimizedProfile = response.data.choices[0].message.content
          uni.showToast({
            title: '优化成功',
            icon: 'success'
          })
        } else {
          throw new Error('优化失败')
        }
      } catch (error) {
        uni.showToast({
          title: '优化失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    copyResult() {
      uni.setClipboardData({
        data: this.optimizedProfile,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success'
          })
        }
      })
    },
    useResult() {
      this.currentProfile = this.optimizedProfile
      uni.showToast({
        title: '已更新',
        icon: 'success'
      })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
  padding: 20rpx;
}

.nav-bar {
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
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
  color: #ff4081;
  margin-bottom: 6rpx;
}

.subtitle {
  font-size: 24rpx;
  color: #666;
}

.content {
  padding: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.input-section {
  position: relative;
  margin-bottom: 30rpx;
}

.input-textarea {
  width: 100%;
  height: 300rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 1.6;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.word-count {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  font-size: 24rpx;
  color: #999;
}

.optimize-btn {
  background: linear-gradient(45deg, #ff4081, #ff80ab);
  color: #fff;
  border-radius: 40rpx;
  padding: 20rpx 0;
  font-size: 32rpx;
  text-align: center;
  margin: 30rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(255, 64, 129, 0.3);
}

.optimize-btn.loading {
  background: #ccc;
}

.result-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.result-content {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin: 20rpx 0;
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
}

.copy-btn, .use-btn {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  border-radius: 40rpx;
  font-size: 28rpx;
  margin: 0 10rpx;
}

.copy-btn {
  background: #f5f5f5;
  color: #666;
}

.use-btn {
  background: #ff4081;
  color: #fff;
}
</style>
