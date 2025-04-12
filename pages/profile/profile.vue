<template>
  <view class="profile-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="title">个人资料</text>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 头像区域 -->
      <view class="avatar-section">
        <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
        <text class="change-avatar" @tap="changeAvatar">更换头像</text>
      </view>

      <!-- 基本信息 -->
      <view class="info-section">
        <view class="info-item">
          <text class="label">昵称</text>
          <text class="value">{{userInfo.nickname || '未设置'}}</text>
        </view>
        <view class="info-item">
          <text class="label">年龄</text>
          <text class="value">{{userInfo.age || '未设置'}}</text>
        </view>
        <view class="info-item">
          <text class="label">性别</text>
          <text class="value">{{userInfo.gender || '未设置'}}</text>
        </view>
        <view class="info-item">
          <text class="label">城市</text>
          <text class="value">{{userInfo.city || '未设置'}}</text>
        </view>
      </view>

      <!-- 个人简介 -->
      <view class="bio-section">
        <view class="section-header">
          <text class="title">个人简介</text>
          <view class="actions">
            <text class="action-btn" @tap="editBio">编辑</text>
          </view>
        </view>
        <view class="bio-content">
          <text>{{userInfo.bio || '这个人很懒，还没有填写个人简介~'}}</text>
        </view>
      </view>

      <!-- 兴趣爱好 -->
      <view class="interests-section">
        <text class="title">兴趣爱好</text>
        <view class="interests-list">
          <text class="interest-tag" v-for="(item, index) in userInfo.interests" :key="index">{{item}}</text>
          <text class="interest-tag add" @tap="editInterests">+</text>
        </view>
      </view>

      <!-- 照片墙 -->
      <view class="photos-section">
        <text class="title">照片墙</text>
        <view class="photos-list">
          <view class="photo-item" v-for="(item, index) in userInfo.photos" :key="index">
            <image :src="item" mode="aspectFill"></image>
          </view>
          <view class="photo-item add" @tap="addPhoto" v-if="userInfo.photos.length < 6">
            <text class="icon">+</text>
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
      userInfo: {
        avatar: '',
        nickname: '',
        age: '',
        gender: '',
        city: '',
        bio: '',
        interests: [],
        photos: []
      }
    }
  },
  onLoad() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      uni.showLoading({
        title: '加载中...'
      })
      // 这里应该调用获取用户信息的API
      setTimeout(() => {
        this.userInfo = {
          avatar: '/static/avatar.jpg',
          nickname: '测试用户',
          age: '25',
          gender: '女',
          city: '北京',
          bio: '这是一个测试的个人简介，用于展示页面效果。',
          interests: ['旅行', '摄影', '美食'],
          photos: ['/static/photo1.jpg', '/static/photo2.jpg']
        }
        uni.hideLoading()
      }, 1000)
    },
    changeAvatar() {
      // TODO: 实现更换头像功能
    },
    editBio() {
      uni.navigateTo({
        url: '/pages/profile/edit?type=bio'
      })
    },
    editInterests() {
      uni.navigateTo({
        url: '/pages/profile/edit?type=interests'
      })
    },
    addPhoto() {
      // TODO: 实现添加照片功能
    }
  }
}
</script>

<style lang="scss">
.profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  
  .nav-bar {
    height: 88rpx;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: var(--status-bar-height);
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .content {
    padding: 30rpx;
  }
  
  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40rpx;
    
    .avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 80rpx;
      margin-bottom: 20rpx;
    }
    
    .change-avatar {
      font-size: 28rpx;
      color: #1890ff;
    }
  }
  
  .info-section {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .label {
        font-size: 28rpx;
        color: #666;
      }
      
      .value {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
  
  .bio-section {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .actions {
        display: flex;
        gap: 20rpx;
        
        .action-btn {
          font-size: 24rpx;
          color: #1890ff;
        }
      }
    }
    
    .bio-content {
      text {
        font-size: 28rpx;
        color: #333;
        line-height: 1.6;
      }
    }
  }
  
  .interests-section {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .interests-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      
      .interest-tag {
        padding: 10rpx 30rpx;
        background: #f5f5f5;
        border-radius: 30rpx;
        font-size: 28rpx;
        color: #666;
        
        &.add {
          background: #1890ff;
          color: #fff;
        }
      }
    }
  }
  
  .photos-section {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .photos-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      
      .photo-item {
        width: calc(33.33% - 14rpx);
        height: 200rpx;
        border-radius: 16rpx;
        overflow: hidden;
        
        image {
          width: 100%;
          height: 100%;
        }
        
        &.add {
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .icon {
            font-size: 60rpx;
            color: #999;
          }
        }
      }
    }
  }
}
</style> 