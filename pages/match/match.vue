<template>
  <view class="container">
    <!-- 匹配卡片区域 -->
    <swiper class="card-swiper" :indicator-dots="false" :autoplay="false" :duration="500" @change="handleSwiperChange">
      <swiper-item v-for="(item, index) in matchList" :key="index">
        <view class="match-card" :class="{ 'active': currentIndex === index }">
          <image class="card-bg" :src="item.avatar_url || '/static/images/default-avatar.png'" mode="aspectFill"></image>
          <view class="card-content">
            <view class="user-info">
              <text class="name">{{item.nickname || item.username}}</text>
              <view class="info-tags">
                <text class="age">{{item.age}}岁</text>
                <text class="location">{{item.location || '未知'}}</text>
              </view>
            </view>
            <view class="interests" v-if="item.interests">
              <text class="interest-tag" v-for="(interest, i) in item.interests.split(',')" :key="i">{{interest}}</text>
            </view>
            <view class="bio">
              <text>{{item.bio || '这个人很懒，什么都没写~'}}</text>
            </view>
          </view>
          <view class="action-buttons">
            <view class="action-btn dislike" @tap="handleDislike(index)">
              <text>×</text>
            </view>
            <view class="action-btn like" @tap="handleLike(index)">
              <text>♥</text>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <!-- 加载提示 -->
    <view class="loading-tip" v-if="loading">
      <view class="loading-spinner"></view>
      <text>正在寻找有缘人...</text>
    </view>
    <!-- 空状态提示 -->
    <view class="empty-state" v-if="!loading && matchList.length === 0">
      <image src="/static/images/empty-state.png" mode="aspectFit"></image>
      <text>暂时没有更多推荐了</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      matchList: [],
      loading: false,
      currentIndex: 0
    }
  },
  onLoad() {
    this.getRecommendations()
  },
  methods: {
    handleSwiperChange(e) {
      this.currentIndex = e.detail.current
    },
    async getRecommendations() {
      this.loading = true
      try {
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
          url: 'http://127.0.0.1:8000/api/user/match/recommendations/',
          method: 'GET',
          header: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.statusCode === 200) {
          this.matchList = response.data
        } else if (response.statusCode === 401) {
          await this.refreshToken()
          await this.getRecommendations()
        } else {
          uni.showToast({
            title: '获取推荐用户失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
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
    async handleLike(index) {
      const user = this.matchList[index]
      if (!user || !user.id) {
        uni.showToast({
          title: '用户信息不完整',
          icon: 'none'
        })
        return
      }
      
      try {
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
          url: 'http://127.0.0.1:8000/api/user/match/like/',
          method: 'POST',
          header: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: {
            to_user: user.id
          }
        })
        
        if (response.statusCode === 201) {
          // 获取当前喜欢列表
          const likesResponse = await uni.request({
            url: 'http://127.0.0.1:8000/api/user/match/likes/',
            method: 'GET',
            header: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (likesResponse.statusCode === 200) {
            // 更新本地存储的喜欢列表
            uni.setStorageSync('likes_list', likesResponse.data)
          }
          
          uni.showToast({
            title: '喜欢成功',
            icon: 'success'
          })
          // 移除已喜欢的用户
          this.matchList.splice(index, 1)
        } else {
          uni.showToast({
            title: response.data.error || '操作失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('点赞失败:', error)
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        })
      }
    },
    handleDislike(index) {
      this.matchList.splice(index, 1)
      uni.showToast({
        title: '已跳过',
        icon: 'none'
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

.card-swiper {
  height: 100vh;
  margin: 0;
}

.match-card {
  position: relative;
  height: 100%;
  border-radius: 30rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
  background: #fff;
  transform: scale(0.95);
  transition: transform 0.3s ease;
}

.match-card.active {
  transform: scale(1);
}

.card-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.match-card.active .card-bg {
  transform: scale(1.05);
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40rpx;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: #fff;
  transform: translateY(20rpx);
  transition: transform 0.3s ease;
}

.match-card.active .card-content {
  transform: translateY(0);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.name {
  font-size: 48rpx;
  font-weight: bold;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
}

.info-tags {
  display: flex;
  gap: 20rpx;
}

.age {
  font-size: 32rpx;
  background: rgba(255,255,255,0.2);
  padding: 4rpx 20rpx;
  border-radius: 20rpx;
  backdrop-filter: blur(10px);
}

.location {
  font-size: 28rpx;
  opacity: 0.8;
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
  margin-bottom: 20rpx;
}

.interest-tag {
  font-size: 24rpx;
  background: rgba(255,255,255,0.2);
  padding: 4rpx 20rpx;
  border-radius: 20rpx;
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease;
}

.interest-tag:active {
  transform: scale(0.95);
}

.bio {
  font-size: 28rpx;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 40rpx;
  text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.3);
}

.action-buttons {
  position: absolute;
  bottom: 40rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 60rpx;
}

.action-btn {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
}

.dislike {
  background: #fff;
  color: #ff4081;
}

.like {
  background: #ff4081;
  color: #fff;
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn:active::after {
  background: rgba(255,255,255,0.3);
}

.loading-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #ff4081;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.empty-state image {
  width: 200rpx;
  height: 200rpx;
  opacity: 0.5;
}

.empty-state text {
  color: #666;
  font-size: 28rpx;
}
</style> 