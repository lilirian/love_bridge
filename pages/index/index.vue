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
          <text class="card-desc">AI帮你分析约会对象的性格特点</text>
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
          <text class="card-title">情感故事分享</text>
          <text class="card-desc">分享你的故事，倾听他人的经历</text>
          <view class="card-button">
            <text>立即使用</text>
            <text class="arrow">→</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部区域 -->
    <view class="footer">
      <text class="footer-text">© 2024 AI恋爱助手</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    navigateTo(url) {
      uni.navigateTo({
        url: url
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
  padding: 40rpx 20rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #ff4081;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:active {
  transform: scale(0.98);
}

.card-image {
  width: 100%;
  height: 200rpx;
  object-fit: cover;
}

.card-content {
  padding: 20rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.card-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.card-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #ff4081, #ff80ab);
  padding: 16rpx 30rpx;
  border-radius: 50rpx;
  color: white;
  font-size: 24rpx;
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
  padding: 40rpx 0;
  margin-top: 40rpx;
}

.footer-text {
  font-size: 24rpx;
  color: #666;
}
</style> 