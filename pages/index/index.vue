<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <image class="logo" src="/static/images/logo.png" mode="aspectFit"></image>
        <text class="title">AI恋爱助手</text>
        <text class="subtitle">用AI帮你找到真爱❤️</text>
      </view>
    </view>

    <!-- 功能卡片区域 -->
    <view class="card-grid">
      <!-- 万能恋爱导师卡片 -->
      <view class="card" @tap="navigateTo('/pages/coach/coach')">
        <image class="card-image" src="/static/images/coach.png" mode="aspectFill"></image>
        <view class="card-content">
          <text class="card-title">万能恋爱导师</text>
          <text class="card-desc">上传聊天记录，让AI帮你分析感情问题</text>
          <view class="card-button">
            <text>立即使用</text>
            <text class="arrow">→</text>
          </view>
        </view>
      </view>

      <!-- 约会对象分析卡片 -->
      <view class="card" @tap="navigateTo('/pages/analyze/analyze')">
        <image class="card-image" src="/static/images/analyze.png" mode="aspectFill"></image>
        <view class="card-content">
          <text class="card-title">约会对象分析</text>
          <text class="card-desc">AI帮你分析约会对象希望的另一半</text>
          <view class="card-button">
            <text>立即使用</text>
            <text class="arrow">→</text>
          </view>
        </view>
      </view>

      <!-- 个人资料优化卡片 -->
      <view class="card" @tap="navigateTo('/pages/profile/profile')">
        <image class="card-image" src="/static/images/profile.png" mode="aspectFill"></image>
        <view class="card-content">
          <text class="card-title">个人资料优化</text>
          <text class="card-desc">让AI帮你打造完美的个人介绍</text>
          <view class="card-button">
            <text>立即使用</text>
            <text class="arrow">→</text>
          </view>
        </view>
      </view>

      <!-- 情感故事分享卡片 -->
      <view class="card" @tap="navigateTo('/pages/stories/stories')">
        <image class="card-image" src="/static/images/stories.png" mode="aspectFill"></image>
        <view class="card-content">
          <text class="card-title">情感故事分析</text>
          <text class="card-desc">分享你的故事，获取AI的专业分析和建议</text>
          <view class="card-button">
            <text>立即使用</text>
            <text class="arrow">→</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部区域 -->
    <view class="footer">
      <text class="footer-text">© 2025 AI恋爱助手</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      storyContent: '',
      analysisResult: '',
      loading: false
    }
  },
  methods: {
    navigateTo(url) {
      uni.navigateTo({
        url: url
      })
    },
    async analyzeStory() {
      if (!this.storyContent.trim()) {
        uni.showToast({
          title: '请输入故事内容',
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
            'Authorization': 'Bearer hDzFpYB0b0qKBYjY5S7PUHMcoR8vCT4t'
          },
          data: {
            assistant_id: 'wxZhHLAo8R9b',
            user_id: 'user_' + Date.now(),
            stream: false,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
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
        })
        
        if (response.statusCode === 200) {
          const result = response.data.choices[0].message.content
          this.analysisResult = result
        } else {
          throw new Error('分析失败')
        }
      } catch (error) {
        uni.showToast({
          title: '分析失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
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
  padding: 20rpx 20rpx;
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

.logo {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
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

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  padding: 16rpx;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:active {
  transform: scale(0.98);
}

.card-image {
  width: 100%;
  height: 160rpx;
  object-fit: cover;
}

.card-content {
  padding: 16rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.card-desc {
  font-size: 22rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

.card-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #ff4081, #ff80ab);
  padding: 12rpx 24rpx;
  border-radius: 40rpx;
  color: white;
  font-size: 22rpx;
  width: fit-content;
}

.arrow {
  margin-left: 10rpx;
  transition: transform 0.3s ease;
}

.card-button:active .arrow {
  transform: translateX(10rpx);
}

.footer {
  text-align: center;
  padding: 20rpx 0;
  margin-top: 20rpx;
}

.footer-text {
  font-size: 22rpx;
  color: #666;
}

.story-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.story-input {
  position: relative;
  margin-bottom: 20rpx;
}

.story-textarea {
  width: 100%;
  height: 400rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 1.6;
}

.word-count {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  font-size: 24rpx;
  color: #999;
}

.analyze-btn {
  background: #ff4081;
  color: #fff;
  border-radius: 40rpx;
  padding: 20rpx 0;
  font-size: 32rpx;
  margin-top: 20rpx;
}

.analyze-btn[disabled] {
  background: #ccc;
}

.analysis-result {
  margin-top: 40rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
}

.result-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.result-content {
  font-size: 28rpx;
  line-height: 1.6;
  color: #666;
}
</style> 