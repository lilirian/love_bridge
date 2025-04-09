<template>
  <view class="container">
    <!-- 顶部用户信息 -->
    <view class="user-header">
      <view class="user-info">
        <image class="avatar" src="/static/images/my/avatar.png" mode="aspectFill"></image>
        <view class="info-content">
          <text class="nickname">小可爱</text>
          <text class="user-id">ID: 888888</text>
        </view>
      </view>
      <view class="edit-btn" @tap="handleEdit">
        <text>编辑资料</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="function-list">
      <view class="function-group">
        <view class="function-item" v-for="(item, index) in functionList" :key="index" @tap="handleFunction(item)">
          <view class="item-left">
            <image class="item-icon" :src="item.icon" mode="aspectFit"></image>
            <text class="item-title">{{item.title}}</text>
          </view>
          <text class="arrow">→</text>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-btn" @tap="handleLogout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      functionList: [
        {
          title: '我的收藏',
          icon: '/static/images/my/collect.png'
        },
        {
          title: '聊天记录',
          icon: '/static/images/my/chat.png'
        },
        {
          title: '隐私设置',
          icon: '/static/images/my/privacy.png'
        },
        {
          title: '关于我们',
          icon: '/static/images/my/about.png'
        }
      ]
    }
  },
  methods: {
    handleEdit() {
      uni.showToast({
        title: '编辑资料',
        icon: 'none'
      })
    },
    handleFunction(item) {
      uni.showToast({
        title: item.title,
        icon: 'none'
      })
    },
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })
          }
        }
      })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
  padding: 20rpx;
}

.user-header {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #fff;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.user-id {
  font-size: 24rpx;
  color: #666;
}

.edit-btn {
  background: linear-gradient(45deg, #ffd54f, #ffc107);
  padding: 20rpx 40rpx;
  border-radius: 40rpx;
  color: #333;
  font-size: 28rpx;
}

.function-list {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.function-group {
  padding: 20rpx 0;
}

.function-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx;
  border-bottom: 2rpx solid rgba(0, 0, 0, 0.05);
}

.function-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.item-icon {
  width: 40rpx;
  height: 40rpx;
}

.item-title {
  font-size: 28rpx;
  color: #333;
}

.arrow {
  color: #999;
  font-size: 28rpx;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 40rpx;
  padding: 30rpx;
  text-align: center;
  color: #ff4081;
  font-size: 28rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.logout-btn:active {
  transform: scale(0.98);
}
</style> 