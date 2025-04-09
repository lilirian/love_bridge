<template>
  <view class="analyze-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="back" @tap="goBack">返回</text>
      <text class="title">约会对象分析</text>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 输入区域 -->
      <view class="input-section" v-if="!analysisResult">
        <view class="input-card">
          <text class="input-title">描述你的约会对象</text>
          <textarea 
            class="input-area" 
            v-model="description" 
            placeholder="请详细描述约会对象的特点，例如：性格、爱好、生活习惯等..."
            maxlength="500"
          ></textarea>
          <text class="input-count">{{description.length}}/500</text>
        </view>
        
        <view class="input-card">
          <text class="input-title">上传照片（可选）</text>
          <view class="photo-upload" @tap="chooseImage">
            <image v-if="photo" :src="photo" mode="aspectFill" class="preview-image"></image>
            <view v-else class="upload-placeholder">
              <text class="icon">📷</text>
              <text class="text">点击上传照片</text>
            </view>
          </view>
        </view>
        
        <button class="analyze-btn" @tap="startAnalysis">开始分析</button>
      </view>

      <!-- 分析结果区域 -->
      <view class="result-section" v-else>
        <!-- 性格特征 -->
        <view class="result-card">
          <text class="card-title">性格特征</text>
          <view class="trait-list">
            <view class="trait-item" v-for="(item, index) in analysisResult.traits" :key="index">
              <text class="trait-name">{{item.name}}</text>
              <view class="trait-bar">
                <view class="bar-inner" :style="{width: item.score + '%'}"></view>
              </view>
              <text class="trait-score">{{item.score}}%</text>
            </view>
          </view>
        </view>

        <!-- 兴趣爱好 -->
        <view class="result-card">
          <text class="card-title">兴趣爱好</text>
          <view class="interest-tags">
            <text class="tag" v-for="(item, index) in analysisResult.interests" :key="index">{{item}}</text>
          </view>
        </view>

        <!-- 生活方式 -->
        <view class="result-card">
          <text class="card-title">生活方式</text>
          <view class="lifestyle-content">
            <text class="content-text">{{analysisResult.lifestyle}}</text>
          </view>
        </view>

        <!-- 相处建议 -->
        <view class="result-card">
          <text class="card-title">相处建议</text>
          <view class="suggestion-list">
            <view class="suggestion-item" v-for="(item, index) in analysisResult.suggestions" :key="index">
              <text class="item-number">{{index + 1}}</text>
              <text class="item-text">{{item}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作区 -->
    <view class="footer" v-if="analysisResult">
      <button class="action-btn" @tap="resetAnalysis">重新分析</button>
      <button class="action-btn primary" @tap="saveResult">保存结果</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      description: '',
      photo: '',
      analysisResult: null
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    chooseImage() {
      // TODO: 实现图片选择功能
      this.photo = '/static/images/default-avatar.png'
    },
    startAnalysis() {
      if (!this.description.trim()) {
        uni.showToast({
          title: '请描述约会对象',
          icon: 'none'
        })
        return
      }
      
      // 模拟分析结果
      this.analysisResult = {
        traits: [
          { name: '外向', score: 75 },
          { name: '理性', score: 60 },
          { name: '细心', score: 85 },
          { name: '幽默', score: 70 }
        ],
        interests: ['旅行', '摄影', '美食', '电影', '音乐'],
        lifestyle: '生活规律，注重健康，喜欢尝试新事物，周末喜欢户外活动。',
        suggestions: [
          '可以多分享一些旅行经历和照片',
          '约会可以选择一些创意餐厅',
          '可以一起参加户外活动',
          '交流时可以多分享一些生活趣事'
        ]
      }
    },
    resetAnalysis() {
      this.description = ''
      this.photo = ''
      this.analysisResult = null
    },
    saveResult() {
      uni.showToast({
        title: '分析结果已保存',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss">
.analyze-container {
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

.content {
  flex: 1;
  padding: 30rpx;
}

.input-section {
  .input-card {
    background-color: #ffffff;
    border-radius: 30rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
    
    .input-title {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .input-area {
      width: 100%;
      height: 300rpx;
      background-color: #f5f5f5;
      border-radius: 20rpx;
      padding: 20rpx;
      font-size: 28rpx;
      color: #333;
    }
    
    .input-count {
      font-size: 24rpx;
      color: #999;
      text-align: right;
      margin-top: 10rpx;
      display: block;
    }
  }
  
  .photo-upload {
    width: 100%;
    height: 300rpx;
    background-color: #f5f5f5;
    border-radius: 20rpx;
    overflow: hidden;
    
    .preview-image {
      width: 100%;
      height: 100%;
    }
    
    .upload-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .icon {
        font-size: 80rpx;
        margin-bottom: 20rpx;
      }
      
      .text {
        font-size: 28rpx;
        color: #999;
      }
    }
  }
  
  .analyze-btn {
    background: linear-gradient(45deg, #FFB6C1, #FF69B4);
    color: #ffffff;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    margin-top: 40rpx;
  }
}

.result-section {
  .result-card {
    background-color: #ffffff;
    border-radius: 30rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
    
    .card-title {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
      margin-bottom: 30rpx;
      display: block;
    }
    
    .trait-list {
      .trait-item {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .trait-name {
          width: 100rpx;
          font-size: 28rpx;
          color: #666;
        }
        
        .trait-bar {
          flex: 1;
          height: 20rpx;
          background-color: #f5f5f5;
          border-radius: 10rpx;
          margin: 0 20rpx;
          overflow: hidden;
          
          .bar-inner {
            height: 100%;
            background: linear-gradient(45deg, #FFB6C1, #FF69B4);
            border-radius: 10rpx;
          }
        }
        
        .trait-score {
          width: 80rpx;
          font-size: 28rpx;
          color: #ff4081;
          text-align: right;
        }
      }
    }
    
    .interest-tags {
      display: flex;
      flex-wrap: wrap;
      
      .tag {
        padding: 10rpx 30rpx;
        background-color: #fce4ec;
        color: #ff4081;
        border-radius: 30rpx;
        font-size: 28rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
      }
    }
    
    .lifestyle-content {
      .content-text {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
      }
    }
    
    .suggestion-list {
      .suggestion-item {
        display: flex;
        margin-bottom: 20rpx;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .item-number {
          width: 40rpx;
          height: 40rpx;
          background: linear-gradient(45deg, #FFB6C1, #FF69B4);
          color: #ffffff;
          border-radius: 20rpx;
          font-size: 24rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20rpx;
        }
        
        .item-text {
          flex: 1;
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
        }
      }
    }
  }
}

.footer {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
  
  .action-btn {
    flex: 1;
    margin: 0 20rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    
    &.primary {
      background: linear-gradient(45deg, #FFB6C1, #FF69B4);
      color: #ffffff;
    }
  }
}
</style> 