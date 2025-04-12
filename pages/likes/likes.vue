<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <view class="nav-left" @tap="goBack">
          <view class="back-icon">←</view>
        </view>
        <view class="nav-center">
          <text class="title">我的喜欢</text>
          <text class="subtitle">你喜欢的用户都在这里</text>
        </view>
      </view>
    </view>

    <!-- 喜欢列表 -->
    <scroll-view class="likes-list" scroll-y>
      <view v-if="likesList.length === 0" class="empty-state">
        <image src="/static/images/empty-likes.png" mode="aspectFit"></image>
        <text>还没有喜欢的用户哦~</text>
      </view>
      <view v-else class="like-item" v-for="(item, index) in likesList" :key="index">
        <image class="avatar" :src="item.avatar_url || '/static/images/default-avatar.png'" mode="aspectFill"></image>
        <view class="user-info">
          <text class="name">{{item.nickname || item.username}}</text>
          <view class="info-tags">
            <text class="age">{{item.age}}岁</text>
            <text class="location">{{item.location || '未知'}}</text>
          </view>
          <view class="interests" v-if="item.interests">
            <text class="interest-tag" v-for="(interest, i) in item.interests.split(',')" :key="i">{{interest}}</text>
          </view>
        </view>
        <view class="action-btn" @tap="handleChat(item)">
          <text>💬</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      likesList: []
    }
  },
  onLoad() {
    this.getLikesList()
  },
  methods: {
    goBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack({
          delta: 1
        })
      } else {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    },
    async getLikesList() {
      try {
        // 先从本地存储获取数据
        const localLikes = uni.getStorageSync('likes_list')
        if (localLikes) {
          this.likesList = localLikes
        }

        const token = uni.getStorageSync('access_token')
        if (!token) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          uni.navigateTo({
            url: '/pages/auth/login'
          })
          return
        }
        
        const response = await uni.request({
          url: 'http://127.0.0.1:8000/match/likes/',
          method: 'GET',
          header: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.statusCode === 200) {
          this.likesList = response.data
          // 更新本地存储
          uni.setStorageSync('likes_list', response.data)
        } else if (response.statusCode === 401) {
          await this.refreshToken()
          await this.getLikesList()
        } else {
          console.log('获取喜欢列表失败，使用本地数据')
        }
      } catch (error) {
        console.error('获取喜欢列表失败:', error)
        console.log('使用本地存储的数据')
      }
    },
    async refreshToken() {
      try {
        const refreshToken = uni.getStorageSync('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        
        const response = await uni.request({
          url: 'http://127.0.0.1:8000/api/user/token/refresh/',
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            refresh: refreshToken
          }
        })
        
        if (response.statusCode === 200) {
          const { access } = response.data
          uni.setStorageSync('access_token', access)
          return true
        }
        return false
      } catch (error) {
        console.error('刷新token失败:', error)
        return false
      }
    },
    handleChat(user) {
      uni.navigateTo({
        url: `/pages/chat-detail/chat-detail?id=${user.id}`
      })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20rpx;
  position: relative;
}

.nav-bar {
  padding: 40rpx 30rpx;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(255, 64, 129, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  flex-shrink: 0;
  border: 1rpx solid rgba(255, 255, 255, 0.5);
}

.nav-content {
  display: flex;
  align-items: center;
  position: relative;
}

.nav-left {
  position: absolute;
  left: 0;
  z-index: 1;
}

.back-icon {
  font-size: 40rpx;
  color: #ff4081;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4rpx 12rpx rgba(255, 64, 129, 0.1);
  transition: all 0.3s ease;
}

.back-icon:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 1);
}

.nav-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 80rpx;
}

.title {
  font-size: 44rpx;
  font-weight: bold;
  background: linear-gradient(45deg, #ff4081, #ff80ab);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12rpx;
  letter-spacing: 2rpx;
}

.subtitle {
  font-size: 26rpx;
  color: #666;
  letter-spacing: 2rpx;
  opacity: 0.8;
}

.likes-list {
  height: calc(100vh - 200rpx);
  padding: 20rpx;
}

.like-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 30rpx;
}

.user-info {
  flex: 1;
}

.name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.info-tags {
  display: flex;
  gap: 20rpx;
  margin-bottom: 10rpx;
}

.age {
  font-size: 28rpx;
  color: #666;
  background: rgba(255, 64, 129, 0.1);
  padding: 4rpx 20rpx;
  border-radius: 20rpx;
}

.location {
  font-size: 28rpx;
  color: #666;
  display: flex;
  align-items: center;
}

.location::before {
  content: '📍';
  margin-right: 6rpx;
}

.interests {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.interest-tag {
  font-size: 24rpx;
  color: #666;
  background: rgba(255, 64, 129, 0.1);
  padding: 4rpx 20rpx;
  border-radius: 20rpx;
}

.action-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #ff4081;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-left: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(255, 64, 129, 0.2);
  transition: all 0.3s ease;
}

.action-btn:active {
  transform: scale(0.95);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40rpx;
}

.empty-state image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-state text {
  font-size: 28rpx;
  color: #666;
}
</style> 