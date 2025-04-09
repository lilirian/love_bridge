<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <text class="title">知音匹配</text>
        <text class="subtitle">找到你的命中注定</text>
      </view>
    </view>

    <!-- 匹配卡片区域 -->
    <swiper class="card-swiper" :indicator-dots="true" :autoplay="false" :duration="500">
      <swiper-item v-for="(item, index) in matchList" :key="index">
        <view class="match-card">
          <image class="card-bg" :src="item.avatar" mode="aspectFill"></image>
          <view class="card-content">
            <view class="user-info">
              <text class="name">{{item.name}}</text>
              <text class="age">{{item.age}}岁</text>
            </view>
            <view class="tags">
              <text class="tag" v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{tag}}</text>
            </view>
            <view class="bio">
              <text>{{item.bio}}</text>
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
  </view>
</template>

<script>
export default {
  data() {
    return {
      matchList: [
        {
          name: '小樱',
          age: 23,
          avatar: '/static/images/match/avatar1.png',
          tags: ['动漫', '旅行', '美食'],
          bio: '喜欢看动漫的元气少女，希望能找到一个志同道合的伙伴~'
        },
        {
          name: '小明',
          age: 25,
          avatar: '/static/images/match/avatar2.png',
          tags: ['游戏', '音乐', '电影'],
          bio: '热爱生活的阳光男孩，期待遇见有趣的你'
        },
        {
          name: '小美',
          age: 22,
          avatar: '/static/images/match/avatar3.png',
          tags: ['绘画', '摄影', '阅读'],
          bio: '文艺少女，喜欢用画笔记录生活的美好'
        }
      ]
    }
  },
  methods: {
    handleLike(index) {
      uni.showToast({
        title: '喜欢成功',
        icon: 'success'
      })
    },
    handleDislike(index) {
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
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
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

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #9c27b0;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
}

.card-swiper {
  height: 1000rpx;
  margin: 20rpx 0;
}

.match-card {
  position: relative;
  height: 100%;
  border-radius: 40rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.2);
}

.card-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40rpx;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.name {
  font-size: 40rpx;
  font-weight: bold;
}

.age {
  font-size: 32rpx;
  background: rgba(255,255,255,0.2);
  padding: 4rpx 20rpx;
  border-radius: 20rpx;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.tag {
  font-size: 24rpx;
  background: rgba(255,255,255,0.2);
  padding: 4rpx 20rpx;
  border-radius: 20rpx;
}

.bio {
  font-size: 28rpx;
  line-height: 1.5;
  opacity: 0.9;
}

.action-buttons {
  position: absolute;
  bottom: 40rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 40rpx;
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
</style> 