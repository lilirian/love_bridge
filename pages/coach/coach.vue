<template>
  <view class="coach-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="back" @tap="goBack">返回</text>
      <text class="title">万能恋爱导师</text>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 上传区域 -->
      <view class="upload-section" v-if="!chatContent">
        <image class="upload-icon" src="/static/images/upload.png" mode="aspectFit"></image>
        <text class="upload-title">上传聊天记录</text>
        <text class="upload-desc">支持txt、doc、pdf等格式</text>
        <button class="upload-btn" @tap="chooseFile">选择文件</button>
      </view>

      <!-- 分析结果区域 -->
      <view class="analysis-section" v-else>
        <!-- 聊天内容预览 -->
        <view class="chat-preview">
          <text class="preview-title">聊天内容预览</text>
          <scroll-view class="chat-content" scroll-y>
            <view class="chat-item" v-for="(item, index) in chatContent" :key="index">
              <text class="chat-time">{{item.time}}</text>
              <view class="chat-bubble" :class="item.isSelf ? 'self' : 'other'">
                <text class="chat-text">{{item.content}}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 分析结果 -->
        <view class="analysis-result">
          <text class="result-title">AI分析结果</text>
          <view class="result-card">
            <view class="result-item">
              <text class="item-title">情感状态</text>
              <text class="item-content">{{analysis.emotion}}</text>
            </view>
            <view class="result-item">
              <text class="item-title">关系阶段</text>
              <text class="item-content">{{analysis.stage}}</text>
            </view>
            <view class="result-item">
              <text class="item-title">潜在问题</text>
              <text class="item-content">{{analysis.problems}}</text>
            </view>
            <view class="result-item">
              <text class="item-title">改善建议</text>
              <text class="item-content">{{analysis.suggestions}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作区 -->
    <view class="footer" v-if="chatContent">
      <button class="action-btn" @tap="reupload">重新上传</button>
      <button class="action-btn primary" @tap="saveAnalysis">保存分析</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      chatContent: null,
      analysis: {
        emotion: '积极向上',
        stage: '暧昧期',
        problems: '沟通频率不够，话题深度不足',
        suggestions: '建议增加日常交流，分享更多生活细节'
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    chooseFile() {
      // TODO: 实现文件选择功能
      // 模拟数据
      this.chatContent = [
        {
          time: '10:00',
          content: '早安呀，今天天气真好',
          isSelf: true
        },
        {
          time: '10:01',
          content: '是啊，很适合出去走走',
          isSelf: false
        }
      ]
    },
    reupload() {
      this.chatContent = null
    },
    saveAnalysis() {
      uni.showToast({
        title: '分析结果已保存',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss">
.coach-container {
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

.upload-section {
  background-color: #ffffff;
  border-radius: 30rpx;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  
  .upload-icon {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }
  
  .upload-title {
    font-size: 36rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  
  .upload-desc {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
  
  .upload-btn {
    background: linear-gradient(45deg, #FFB6C1, #FF69B4);
    color: #ffffff;
    padding: 20rpx 60rpx;
    border-radius: 50rpx;
    font-size: 28rpx;
  }
}

.analysis-section {
  .chat-preview {
    background-color: #ffffff;
    border-radius: 30rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
    
    .preview-title {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .chat-content {
      height: 400rpx;
      
      .chat-item {
        margin-bottom: 20rpx;
        
        .chat-time {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 10rpx;
          display: block;
        }
        
        .chat-bubble {
          max-width: 80%;
          padding: 20rpx;
          border-radius: 20rpx;
          font-size: 28rpx;
          
          &.self {
            background-color: #FFB6C1;
            color: #ffffff;
            margin-left: auto;
          }
          
          &.other {
            background-color: #f5f5f5;
            color: #333;
          }
        }
      }
    }
  }
  
  .analysis-result {
    .result-title {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .result-card {
      background-color: #ffffff;
      border-radius: 30rpx;
      padding: 30rpx;
      box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
      
      .result-item {
        margin-bottom: 30rpx;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .item-title {
          font-size: 28rpx;
          color: #666;
          margin-bottom: 10rpx;
          display: block;
        }
        
        .item-content {
          font-size: 32rpx;
          color: #333;
          line-height: 1.5;
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