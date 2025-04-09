<template>
  <view class="stories-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="back" @tap="goBack">返回</text>
      <text class="title">情感故事分享</text>
    </view>

    <!-- 故事分类标签 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-list">
        <view 
          v-for="(item, index) in categories" 
          :key="index"
          :class="['category-item', currentCategory === index ? 'active' : '']"
          @tap="selectCategory(index)"
        >
          {{item}}
        </view>
      </view>
    </scroll-view>

    <!-- 故事列表 -->
    <scroll-view class="story-list" scroll-y @scrolltolower="loadMore">
      <view v-if="stories.length === 0" class="empty-state">
        <image src="/static/images/empty-stories.png" mode="aspectFit" class="empty-image"></image>
        <text class="empty-text">还没有故事哦，快来分享你的故事吧~</text>
      </view>
      <view v-else class="story-item" v-for="(item, index) in stories" :key="index" @tap="viewStory(item)">
        <view class="story-header">
          <image :src="item.avatar" class="avatar"></image>
          <view class="user-info">
            <text class="username">{{item.username}}</text>
            <text class="time">{{item.time}}</text>
          </view>
          <view class="story-tag">{{categories[item.category]}}</view>
        </view>
        <view class="story-content">
          <text class="story-title">{{item.title}}</text>
          <text class="story-preview">{{item.content}}</text>
        </view>
        <view class="story-footer">
          <view class="action-item">
            <text class="icon">❤️</text>
            <text class="count">{{item.likes}}</text>
          </view>
          <view class="action-item">
            <text class="icon">💬</text>
            <text class="count">{{item.comments}}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 发布按钮 -->
    <view class="publish-btn" @tap="publishStory">
      <text class="icon">✏️</text>
      <text>写故事</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      categories: ['全部', '初恋', '异地恋', '分手', '复合', '暗恋', '相亲', '其他'],
      currentCategory: 0,
      stories: []
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    selectCategory(index) {
      this.currentCategory = index
      // TODO: 根据分类加载故事
    },
    loadMore() {
      // TODO: 加载更多故事
    },
    viewStory(story) {
      uni.navigateTo({
        url: `/pages/story-detail/story-detail?id=${story.id}`
      })
    },
    publishStory() {
      uni.navigateTo({
        url: '/pages/story-publish/story-publish'
      })
    }
  }
}
</script>

<style lang="scss">
.stories-container {
  min-height: 100vh;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  height: 88rpx;
  background: linear-gradient(45deg, #FFB6C1, #FF69B4);
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  padding-top: var(--status-bar-height);
  
  .back {
    color: #ffffff;
    font-size: 28rpx;
  }
  
  .title {
    flex: 1;
    text-align: center;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: bold;
  }
}

.category-scroll {
  background-color: #ffffff;
  padding: 20rpx 0;
  white-space: nowrap;
  
  .category-list {
    display: inline-flex;
    padding: 0 20rpx;
    
    .category-item {
      padding: 10rpx 30rpx;
      margin-right: 20rpx;
      background-color: #f5f5f5;
      border-radius: 30rpx;
      font-size: 28rpx;
      color: #666;
      
      &.active {
        background: linear-gradient(45deg, #FFB6C1, #FF69B4);
        color: #ffffff;
      }
    }
  }
}

.story-list {
  flex: 1;
  padding: 20rpx;
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    
    .empty-image {
      width: 300rpx;
      height: 300rpx;
      margin-bottom: 30rpx;
    }
    
    .empty-text {
      color: #999;
      font-size: 28rpx;
    }
  }
  
  .story-item {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
    
    .story-header {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      
      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      
      .user-info {
        flex: 1;
        
        .username {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
          display: block;
        }
        
        .time {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .story-tag {
        padding: 6rpx 20rpx;
        background-color: #fce4ec;
        color: #ff4081;
        border-radius: 20rpx;
        font-size: 24rpx;
      }
    }
    
    .story-content {
      margin-bottom: 20rpx;
      
      .story-title {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 10rpx;
        display: block;
      }
      
      .story-preview {
        font-size: 28rpx;
        color: #666;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
    }
    
    .story-footer {
      display: flex;
      align-items: center;
      
      .action-item {
        display: flex;
        align-items: center;
        margin-right: 40rpx;
        
        .icon {
          font-size: 32rpx;
          margin-right: 10rpx;
        }
        
        .count {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

.publish-btn {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  background: linear-gradient(45deg, #FFB6C1, #FF69B4);
  color: #ffffff;
  padding: 20rpx 40rpx;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(255,105,180,0.3);
  
  .icon {
    font-size: 32rpx;
    margin-right: 10rpx;
  }
  
  text {
    font-size: 28rpx;
  }
}
</style> 