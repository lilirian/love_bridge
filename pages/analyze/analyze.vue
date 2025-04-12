<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <text class="title">约会对象分析</text>
        <text class="subtitle">AI帮你分析约会对象希望的另一半</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 输入区域 -->
      <view class="input-section">
        <text class="section-title">约会对象特征</text>
        <view class="input-card">
          <textarea 
            class="input-textarea" 
            v-model="targetFeatures" 
            placeholder="请描述约会对象的特征，例如：
- 年龄、职业
- 兴趣爱好
- 性格特点
- 生活习惯
- 价值观
- 其他重要信息..."
            :maxlength="1000"
          ></textarea>
          <text class="word-count">{{ targetFeatures.length }}/1000</text>
        </view>
      </view>

      <!-- 分析按钮 -->
      <view class="analyze-btn" @tap="analyzeTarget" :class="{ 'loading': loading }">
        <text v-if="!loading">开始分析</text>
        <text v-else>分析中...</text>
      </view>

      <!-- 分析结果 -->
      <view class="result-section" v-if="analysisResult">
        <text class="section-title">分析结果</text>
        <view class="result-card">
          <view class="result-content">
            <text>{{ analysisResult }}</text>
          </view>
          <view class="action-buttons">
            <view class="copy-btn" @tap="copyResult">
              <text>复制结果</text>
            </view>
            <view class="save-btn" @tap="saveResult">
              <text>保存分析</text>
            </view>
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
      targetFeatures: '',
      analysisResult: '',
      loading: false
    }
  },
  methods: {
    async analyzeTarget() {
      if (!this.targetFeatures.trim()) {
        uni.showToast({
          title: '请输入约会对象特征',
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
            'Authorization': 'Bearer YMIX3JyOKlPHvrYJ3xmy2pRwrPCdJSbl'
          },
          data: {
            assistant_id: 'P4XEtqPu95io',
            user_id: 'user_' + Date.now(),
            stream: false,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `请根据以下约会对象的特征，分析他们可能希望的另一半类型：

${this.targetFeatures}

请从以下几个方面进行分析：
1. 理想伴侣的性格特点
2. 可能看重的价值观
3. 期望的生活方式
4. 潜在的兴趣爱好匹配
5. 可能存在的潜在问题
6. 相处建议

请给出详细的分析和建议，帮助用户更好地了解如何与这位约会对象相处。`
                  }
                ]
              }
            ]
          }
        })
        
        if (response.statusCode === 200) {
          this.analysisResult = response.data.choices[0].message.content
          uni.showToast({
            title: '分析成功',
            icon: 'success'
          })
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
    copyResult() {
      uni.setClipboardData({
        data: this.analysisResult,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success'
          })
        }
      })
    },
    saveResult() {
      // TODO: 实现保存功能
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
  padding: 20rpx;
}

.nav-bar {
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #ff4081;
  margin-bottom: 10rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 26rpx;
  color: #666;
}

.content {
  padding: 20rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.input-section {
  margin-bottom: 30rpx;
}

.input-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  border: 2rpx solid #ff4081;
  transition: all 0.3s ease;
  overflow: hidden;
}

.input-card:focus-within {
  border-color: #ff80ab;
  box-shadow: 0 6rpx 30rpx rgba(255, 64, 129, 0.2);
}

.input-textarea {
  width: 100%;
  height: 400rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  font-size: 28rpx;
  line-height: 1.8;
  color: #333;
  border: none;
  resize: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.input-textarea:focus {
  outline: none;
  background: #fff;
}

.input-textarea::placeholder {
  color: #999;
  font-size: 26rpx;
  line-height: 1.6;
}

.word-count {
  position: absolute;
  right: 30rpx;
  bottom: 30rpx;
  font-size: 24rpx;
  color: #999;
  background: rgba(255, 255, 255, 0.9);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.analyze-btn {
  background: linear-gradient(45deg, #ff4081, #ff80ab);
  color: #fff;
  border-radius: 50rpx;
  padding: 25rpx 0;
  font-size: 34rpx;
  text-align: center;
  margin: 40rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(255, 64, 129, 0.3);
  transition: all 0.3s ease;
}

.analyze-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 10rpx rgba(255, 64, 129, 0.2);
}

.analyze-btn.loading {
  background: #ccc;
}

.result-section {
  margin-top: 40rpx;
}

.result-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.result-content {
  background: #f8f9fa;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx 0;
  font-size: 28rpx;
  line-height: 1.8;
  color: #333;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  max-height: 800rpx;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
  gap: 20rpx;
}

.copy-btn, .save-btn {
  flex: 1;
  text-align: center;
  padding: 25rpx 0;
  border-radius: 50rpx;
  font-size: 30rpx;
  transition: all 0.3s ease;
}

.copy-btn {
  background: #f5f5f5;
  color: #666;
}

.copy-btn:active {
  background: #e0e0e0;
  transform: scale(0.98);
}

.save-btn {
  background: linear-gradient(45deg, #ff4081, #ff80ab);
  color: #fff;
}

.save-btn:active {
  background: linear-gradient(45deg, #f50057, #ff4081);
  transform: scale(0.98);
}
</style> 