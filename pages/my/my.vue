<template>
  <view class="my-container">
    <!-- 顶部用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <view class="avatar-wrapper">
          <image :src="userAvatar" mode="aspectFill" class="avatar"></image>
          <view class="online-status" :class="{'online': isLoggedIn}"></view>
          <view class="edit-avatar" @tap="changeAvatar">
            <text class="icon">📷</text>
          </view>
        </view>
        <view class="info">
          <text class="username">{{ userInfo?.username || '未登录' }}</text>
          <text class="email">{{ userInfo?.email || '请登录' }}</text>
          <view class="vip-badge" v-if="isLoggedIn">
            <text class="icon">⭐</text>
            <text>VIP会员</text>
          </view>
        </view>
      </view>
      <view class="stats">
        <view class="stat-item" @tap="goToFollowing">
          <text class="number">{{ userProfile?.following || 0 }}</text>
          <text class="label">关注</text>
        </view>
        <view class="stat-item" @tap="goToFollowers">
          <text class="number">{{ userProfile?.followers || 0 }}</text>
          <text class="label">粉丝</text>
        </view>
        <view class="stat-item" @tap="goToLikes">
          <text class="number">{{ userProfile?.likes || 0 }}</text>
          <text class="label">喜欢</text>
        </view>
        <view class="stat-item" @tap="goToMatches">
          <text class="number">{{ userProfile?.matches || 0 }}</text>
          <text class="label">匹配</text>
        </view>
      </view>
    </view>
    
    <!-- 功能菜单列表 -->
    <view class="menu-list">
      <view class="menu-section">
        <text class="section-title">账号管理</text>
        <view class="menu-item" @tap="goToProfile">
          <view class="icon-wrapper">
            <text class="icon">👤</text>
          </view>
          <text class="text">个人资料</text>
          <text class="arrow">→</text>
        </view>
        <view class="menu-item" @tap="goToSettings">
          <view class="icon-wrapper">
            <text class="icon">⚙️</text>
          </view>
          <text class="text">设置</text>
          <text class="arrow">→</text>
        </view>
      </view>
      
      <view class="menu-section">
        <text class="section-title">社交互动</text>
        <view class="menu-item" @tap="goToMessages">
          <view class="icon-wrapper">
            <text class="icon">💌</text>
          </view>
          <text class="text">消息中心</text>
          <text class="badge" v-if="unreadMessages > 0">{{unreadMessages}}</text>
          <text class="arrow">→</text>
        </view>
        <view class="menu-item" @tap="goToStories">
          <view class="icon-wrapper">
            <text class="icon">📝</text>
          </view>
          <text class="text">我的故事</text>
          <text class="arrow">→</text>
        </view>
      </view>
      
      <view class="menu-section">
        <text class="section-title">其他</text>
        <view class="menu-item" @tap="goToHelp">
          <view class="icon-wrapper">
            <text class="icon">❓</text>
          </view>
          <text class="text">帮助中心</text>
          <text class="arrow">→</text>
        </view>
        <view class="menu-item" @tap="handleLogout" v-if="isLoggedIn">
          <view class="icon-wrapper">
            <text class="icon">🚪</text>
          </view>
          <text class="text">退出登录</text>
          <text class="arrow">→</text>
        </view>
      </view>
    </view>
    
    <!-- 底部装饰 -->
    <view class="decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const unreadMessages = ref(0)

const isLoggedIn = computed(() => store.state.isLoggedIn)
const userInfo = computed(() => store.state.userInfo)
const userProfile = computed(() => store.state.userProfile)
const userAvatar = computed(() => {
  if (userProfile.value?.avatar_url) {
    return userProfile.value.avatar_url
  }
  return '/static/images/default-avatar.png'
})

const changeAvatar = () => {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: '/pages/auth/login'
    })
    return
  }
  uni.chooseImage({
    count: 1,
    success: (res) => {
      // TODO: 上传头像
      console.log('选择图片成功', res)
    }
  })
}

const goToProfile = () => {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: '/pages/auth/login'
    })
    return
  }
  uni.navigateTo({
    url: '/pages/profile/optimize'
  })
}

const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/settings/settings'
  })
}

const goToFollowing = () => {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: '/pages/auth/login'
    })
    return
  }
  uni.navigateTo({
    url: '/pages/following/following'
  })
}

const goToFollowers = () => {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: '/pages/auth/login'
    })
    return
  }
  uni.navigateTo({
    url: '/pages/followers/followers'
  })
}

const goToLikes = () => {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: '/pages/auth/login'
    })
    return
  }
  uni.navigateTo({
    url: '/pages/likes/likes'
  })
}

const goToMatches = () => {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: '/pages/auth/login'
    })
    return
  }
  uni.navigateTo({
    url: '/pages/matches/matches'
  })
}

const goToMessages = () => {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: '/pages/auth/login'
    })
    return
  }
  uni.navigateTo({
    url: '/pages/messages/messages'
  })
}

const goToStories = () => {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: '/pages/auth/login'
    })
    return
  }
  uni.navigateTo({
    url: '/pages/stories/stories'
  })
}

const goToHelp = () => {
  uni.navigateTo({
    url: '/pages/help/help'
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        store.commit('logout')
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
        uni.navigateTo({
          url: '/pages/auth/login'
        })
      }
    }
  })
}

// 页面显示时获取用户信息
onMounted(() => {
  if (isLoggedIn.value) {
    store.dispatch('fetchUserProfile')
    // TODO: 获取未读消息数
  } else {
    uni.navigateTo({
      url: '/pages/auth/login'
    })
  }
})
</script>

<style lang="scss">
.my-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #ffb6c1 100%);
  padding: 40rpx;
  position: relative;
  overflow: hidden;
  
  .user-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 30rpx;
    padding: 40rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    
    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 40rpx;
      
      .avatar-wrapper {
        position: relative;
        margin-right: 30rpx;
        
        .avatar {
          width: 140rpx;
          height: 140rpx;
          border-radius: 70rpx;
          border: 4rpx solid #fff;
          box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
        }
        
        .online-status {
          position: absolute;
          bottom: 10rpx;
          right: 10rpx;
          width: 24rpx;
          height: 24rpx;
          border-radius: 12rpx;
          background: #ccc;
          border: 2rpx solid #fff;
          
          &.online {
            background: #4CAF50;
          }
        }
        
        .edit-avatar {
          position: absolute;
          bottom: -10rpx;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 64, 129, 0.9);
          width: 40rpx;
          height: 40rpx;
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
          
          .icon {
            font-size: 24rpx;
            color: #fff;
          }
        }
      }
      
      .info {
        flex: 1;
        
        .username {
          font-size: 40rpx;
          font-weight: bold;
          color: #333;
          display: block;
          margin-bottom: 10rpx;
        }
        
        .email {
          font-size: 28rpx;
          color: #666;
          display: block;
          margin-bottom: 10rpx;
        }
        
        .vip-badge {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          padding: 4rpx 16rpx;
          border-radius: 20rpx;
          
          .icon {
            font-size: 24rpx;
            margin-right: 6rpx;
          }
          
          text {
            font-size: 24rpx;
            color: #fff;
          }
        }
      }
    }
    
    .stats {
      display: flex;
      justify-content: space-around;
      border-top: 1rpx solid rgba(0, 0, 0, 0.05);
      padding-top: 30rpx;
      
      .stat-item {
        text-align: center;
        flex: 1;
        
        .number {
          font-size: 36rpx;
          font-weight: bold;
          color: #ff4081;
          display: block;
          margin-bottom: 10rpx;
        }
        
        .label {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
  
  .menu-list {
    .menu-section {
      margin-bottom: 30rpx;
      
      .section-title {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 20rpx;
        padding-left: 20rpx;
        display: block;
      }
      
      .menu-item {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20rpx;
        padding: 30rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.95);
        }
        
        .icon-wrapper {
          width: 80rpx;
          height: 80rpx;
          background: rgba(255, 64, 129, 0.1);
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20rpx;
          
          .icon {
            font-size: 40rpx;
          }
        }
        
        .text {
          flex: 1;
          font-size: 32rpx;
          color: #333;
        }
        
        .badge {
          background: #ff4081;
          color: #fff;
          font-size: 24rpx;
          padding: 4rpx 12rpx;
          border-radius: 20rpx;
          margin-right: 20rpx;
        }
        
        .arrow {
          font-size: 32rpx;
          color: #999;
        }
      }
    }
  }
  
  .decoration {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    
    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      animation: float 6s ease-in-out infinite;
      
      &.circle-1 {
        width: 400rpx;
        height: 400rpx;
        top: -100rpx;
        right: -100rpx;
        animation-delay: 0s;
      }
      
      &.circle-2 {
        width: 300rpx;
        height: 300rpx;
        bottom: -50rpx;
        left: -50rpx;
        animation-delay: 2s;
      }
      
      &.circle-3 {
        width: 200rpx;
        height: 200rpx;
        top: 50%;
        right: 20%;
        animation-delay: 4s;
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20rpx);
  }
}
</style> 