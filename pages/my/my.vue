<template>
  <view class="my-container">
    <view class="user-info">
      <view class="avatar">
        <image :src="userAvatar" mode="aspectFill"></image>
      </view>
      <view class="info">
        <text class="username">{{ userInfo?.username || '未登录' }}</text>
        <text class="email">{{ userInfo?.email || '请登录' }}</text>
      </view>
    </view>
    
    <view class="menu-list">
      <view class="menu-item" @tap="goToProfile">
        <text class="icon">👤</text>
        <text class="text">个人资料</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @tap="goToSettings">
        <text class="icon">⚙️</text>
        <text class="text">设置</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @tap="handleLogout" v-if="isLoggedIn">
        <text class="icon">🚪</text>
        <text class="text">退出登录</text>
        <text class="arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isLoggedIn = computed(() => store.state.isLoggedIn)
const userInfo = computed(() => store.state.userInfo)
const userProfile = computed(() => store.state.userProfile)
const userAvatar = computed(() => userProfile.value?.avatar || '/static/images/default-avatar.png')

const goToProfile = () => {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: '/pages/auth/login'
    })
    return
  }
  uni.navigateTo({
    url: '/pages/profile/profile'
  })
}

const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/settings/settings'
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
  }
})
</script>

<style lang="scss">
.my-container {
  padding: 40rpx;
  
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 60rpx;
    
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      overflow: hidden;
      margin-right: 30rpx;
      
      image {
        width: 100%;
        height: 100%;
      }
    }
    
    .info {
      .username {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        display: block;
        margin-bottom: 10rpx;
      }
      
      .email {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
  
  .menu-list {
    .menu-item {
      display: flex;
      align-items: center;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #eee;
      
      .icon {
        font-size: 40rpx;
        margin-right: 20rpx;
      }
      
      .text {
        flex: 1;
        font-size: 32rpx;
        color: #333;
      }
      
      .arrow {
        font-size: 32rpx;
        color: #999;
      }
    }
  }
}
</style> 