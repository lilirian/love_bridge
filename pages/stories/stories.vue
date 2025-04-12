<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <view class="nav-left" @tap="goBack">
          <view class="back-icon">←</view>
        </view>
        <view class="nav-center">
          <text class="title">AI情感故事分析</text>
          <text class="subtitle">分享你的故事，获取专业建议</text>
        </view>
      </view>
    </view>

    <!-- 故事分析区域 -->
    <scroll-view class="story-section" scroll-y>
      <view class="section-header">
        <view class="header-icon">💭</view>
        <text class="section-title">分享你的故事</text>
        <text class="section-desc">AI将为你提供专业的分析和建议</text>
      </view>
      
      <view class="story-input">
        <view class="input-header">
          <text class="input-title">故事内容</text>
          <view class="upload-btn" @tap="chooseFile">
            <text class="upload-icon">📄</text>
            <text class="upload-text">上传文件</text>
          </view>
        </view>
        <textarea 
          v-model="storyContent" 
          placeholder="请分享你的情感故事，AI将为你分析并提供建议..."
          maxlength="1000"
          class="story-textarea"
          :adjust-position="false"
        ></textarea>
        <view class="word-count">{{storyContent.length}}/1000</view>
      </view>
      
      <button 
        class="analyze-btn" 
        @tap="analyzeStory" 
        :disabled="!storyContent.trim() || loading"
        :class="{'loading': loading}"
      >
        <text v-if="!loading">开始分析</text>
        <view v-else class="loading-spinner"></view>
      </button>
      
      <!-- 分析结果 -->
      <view class="analysis-result" v-if="analysisResult">
        <view class="result-header">
          <view class="result-icon">✨</view>
          <text class="result-title">分析结果</text>
          <view class="result-decoration"></view>
        </view>
        <view class="result-content">
          <text>{{analysisResult}}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      storyContent: '',
      analysisResult: '',
      loading: false
    }
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
    async analyzeStory() {
      if (!this.storyContent.trim()) {
        uni.showToast({
          title: '请输入故事内容',
          icon: 'none'
        })
        return
      }
      
      this.loading = true
      try {
        const response = await uni.request({
          url: 'https://open.hunyuan.tencent.com/openapi/v1/agent/chat/completions',
          method: 'POST',
          header: {
            'X-Source': 'openapi',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer hDzFpYB0b0qKBYjY5S7PUHMcoR8vCT4t'
          },
          data: {
            assistant_id: 'wxZhHLAo8R9b',
            user_id: 'user_' + Date.now(),
            stream: false,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `请分析以下情感故事，并给出对男女主角的建议：
                    
${this.storyContent}

请从以下几个方面进行分析：
1. 故事中的主要问题
2. 男女主角的行为分析
3. 建议的改进方案
4. 情感关系的建议`
                  }
                ]
              }
            ]
          }
        })
        
        if (response.statusCode === 200) {
          const result = response.data.choices[0].message.content
          this.analysisResult = result
        } else {
          throw new Error('分析失败')
        }
      } catch (error) {
        uni.showToast({
          title: '分析失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    async chooseFile() {
      try {
        const res = await uni.chooseFile({
          count: 1,
          type: 'file',
          extension: ['.txt', '.md']
        })
        
        if (res.tempFiles && res.tempFiles.length > 0) {
          const file = res.tempFiles[0]
          if (file.size > 1024 * 1024) { // 限制文件大小1MB
            uni.showToast({
              title: '文件大小不能超过1MB',
              icon: 'none'
            })
            return
          }
          
          this.loading = true
          const content = await this.readFileContent(file)
          this.storyContent = content.slice(0, 1000) // 限制内容长度
          this.loading = false
        }
      } catch (error) {
        console.error('选择文件失败:', error)
        uni.showToast({
          title: '选择文件失败',
          icon: 'none'
        })
      }
    },
    
    readFileContent(file) {
      return new Promise((resolve, reject) => {
        // #ifdef H5
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target.result)
        }
        reader.onerror = (e) => {
          reject(e)
        }
        // 在H5环境下，file是File对象，可以直接使用
        reader.readAsText(file)
        // #endif
        
        // #ifdef APP-PLUS
        plus.io.resolveLocalFileSystemURL(file.path, (entry) => {
          entry.file((file) => {
            const reader = new plus.io.FileReader()
            reader.onload = (e) => {
              resolve(e.target.result)
            }
            reader.onerror = (e) => {
              reject(e)
            }
            reader.readAsText(file)
          })
        })
        // #endif
        
        // #ifdef MP
        uni.getFileSystemManager().readFile({
          filePath: file.path,
          encoding: 'utf8',
          success: (res) => {
            resolve(res.data)
          },
          fail: (err) => {
            reject(err)
          }
        })
        // #endif
      })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%);
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
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

.story-section {
  flex: 1;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(255, 64, 129, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: calc(100vh - 200rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
}

.section-header {
  margin-bottom: 40rpx;
  text-align: center;
  flex-shrink: 0;
}

.header-icon {
  font-size: 48rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 38rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
  letter-spacing: 2rpx;
}

.section-desc {
  font-size: 26rpx;
  color: #666;
  display: block;
  opacity: 0.8;
}

.story-input {
  position: relative;
  margin-bottom: 40rpx;
  flex: 1;
  min-height: 200rpx;
  max-height: 400rpx;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.input-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.upload-btn {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(255, 64, 129, 0.1);
  border: 2rpx solid rgba(255, 64, 129, 0.15);
  transition: all 0.3s ease;
}

.upload-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 1);
}

.upload-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
}

.upload-text {
  font-size: 26rpx;
  color: #ff4081;
  font-weight: 500;
}

.story-textarea {
  width: 100%;
  height: 100%;
  min-height: 200rpx;
  max-height: 400rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 30rpx;
  font-size: 28rpx;
  line-height: 1.8;
  border: 2rpx solid rgba(255, 64, 129, 0.15);
  transition: all 0.3s ease;
  box-sizing: border-box;
  color: #333;
  box-shadow: inset 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
}

.story-textarea:focus {
  border-color: rgba(255, 64, 129, 0.3);
  box-shadow: inset 0 2rpx 12rpx rgba(255, 64, 129, 0.08);
  background: rgba(255, 255, 255, 1);
}

.word-count {
  position: absolute;
  right: 30rpx;
  bottom: 30rpx;
  font-size: 24rpx;
  color: #999;
  background: rgba(255, 255, 255, 0.9);
  padding: 6rpx 16rpx;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
}

.analyze-btn {
  background: linear-gradient(45deg, #ff4081, #ff80ab);
  color: #fff;
  border-radius: 50rpx;
  padding: 28rpx 0;
  font-size: 32rpx;
  margin-top: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 64, 129, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  letter-spacing: 2rpx;
  font-weight: 500;
}

.analyze-btn:active {
  transform: translateY(4rpx);
  box-shadow: 0 4rpx 12rpx rgba(255, 64, 129, 0.2);
}

.analyze-btn[disabled] {
  background: #ccc;
  box-shadow: none;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.analysis-result {
  margin-top: 40rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  border: 2rpx solid rgba(255, 64, 129, 0.15);
  flex-shrink: 0;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.result-header {
  margin-bottom: 30rpx;
  position: relative;
  display: flex;
  align-items: center;
}

.result-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.result-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  display: inline-block;
  padding-right: 20rpx;
  background: linear-gradient(45deg, #ff4081, #ff80ab);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2rpx;
}

.result-decoration {
  position: absolute;
  bottom: -10rpx;
  left: 0;
  width: 60rpx;
  height: 4rpx;
  background: linear-gradient(45deg, #ff4081, #ff80ab);
  border-radius: 2rpx;
}

.result-content {
  font-size: 28rpx;
  line-height: 1.8;
  color: #666;
  padding: 20rpx 0;
}
</style> 