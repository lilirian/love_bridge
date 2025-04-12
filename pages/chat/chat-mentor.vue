<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <text class="title">万能恋爱导师</text>
        <text class="subtitle">上传聊天截图，获取专业建议</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 上传区域 -->
      <view class="upload-section">
        <view class="upload-card" @tap="chooseImage">
          <image v-if="imageUrl" :src="imageUrl" mode="aspectFit" class="preview-image"></image>
          <view v-else class="upload-placeholder">
            <text class="upload-icon">+</text>
            <text class="upload-text">点击上传聊天截图</text>
            <text class="upload-tip">支持PNG、JPG、JPEG格式</text>
          </view>
        </view>
      </view>

      <!-- 文本输入区域 -->
      <view class="text-input-section">
        <text class="section-title">或直接输入聊天内容</text>
        <textarea 
          class="chat-input" 
          v-model="chatText" 
          placeholder="请输入聊天内容..." 
          :disabled="loading"
        ></textarea>
      </view>

      <!-- 分析按钮 -->
      <view class="analyze-btn" @tap="analyzeChat" :class="{ 'loading': loading }">
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
              <text>保存建议</text>
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
      imageUrl: '',
      imageBase64: '',
      chatText: '',
      analysisResult: '',
      loading: false
    }
  },
  methods: {
    async chooseImage() {
      try {
        // 先显示一个操作菜单让用户选择图片来源
        const { tapIndex } = await new Promise((resolve, reject) => {
          uni.showActionSheet({
            itemList: ['从相册选择', '拍照'],
            success: resolve,
            fail: reject
          })
        })

        // 根据用户选择设置sourceType
        const sourceType = tapIndex === 0 ? ['album'] : ['camera']
        
        // 执行文件选择
        const res = await new Promise((resolve, reject) => {
          uni.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: sourceType,
            success: resolve,
            fail: reject
          })
        })
        
        this.imageUrl = res.tempFilePaths[0]
        
        // 将图片转换为base64
        const base64 = await this.imageToBase64(res.tempFilePaths[0])
        this.imageBase64 = base64.replace(/^data:image\/\w+;base64,/, '')
        
        // 清空文本输入
        this.chatText = ''
      } catch (error) {
        // 用户取消选择时不显示错误提示
        if (error.errMsg && !error.errMsg.includes('cancel')) {
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        }
      }
    },
    
    imageToBase64(filePath) {
      return new Promise((resolve, reject) => {
        uni.getFileSystemManager().readFile({
          filePath: filePath,
          encoding: 'base64',
          success: res => {
            resolve(res.data)
          },
          fail: err => {
            reject(err)
          }
        })
      })
    },
    
    async analyzeChat() {
      let chatContent = ''
      
      if (this.imageBase64) {
        // 如果有图片，使用OCR识别
        try {
          const ocrResponse = await uni.request({
            url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              access_token: await this.getBaiduToken(),
              image: this.imageBase64
            }
          })
          
          if (ocrResponse.statusCode === 200 && ocrResponse.data.words_result) {
            chatContent = ocrResponse.data.words_result.map(item => item.words).join('\n')
          } else {
            throw new Error('OCR识别失败')
          }
        } catch (error) {
          uni.showToast({
            title: '图片识别失败',
            icon: 'none'
          })
          return
        }
      } else if (this.chatText.trim()) {
        // 如果有文本输入，直接使用
        chatContent = this.chatText
      } else {
        uni.showToast({
          title: '请上传图片或输入聊天内容',
          icon: 'none'
        })
        return
      }

      this.loading = true
      try {
        // 调用腾讯元宝API
        const aiResponse = await uni.request({
          url: 'https://open.hunyuan.tencent.com/openapi/v1/agent/chat/completions',
          method: 'POST',
          header: {
            'X-Source': 'openapi',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer WGoAkgDx8SMvP1vrqLitDvOSQCfOylRk'
          },
          data: {
            assistant_id: 'XiZKiK5UzdSr',
            user_id: 'user_' + Date.now(),
            stream: false,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `请分析以下聊天记录，给出专业的恋爱建议：

${chatContent}

请从以下几个方面进行分析：
1. 聊天氛围和互动方式
2. 双方的情感表达
3. 潜在的问题和矛盾
4. 改进建议
5. 后续发展建议

请给出详细的分析和建议。`
                  }
                ]
              }
            ]
          }
        })
        
        if (aiResponse.statusCode === 200) {
          this.analysisResult = aiResponse.data.choices[0].message.content
          uni.showToast({
            title: '分析成功',
            icon: 'success'
          })
        } else {
          throw new Error('AI分析失败')
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
    
    async getBaiduToken() {
      try {
        const response = await uni.request({
          url: 'https://aip.baidubce.com/oauth/2.0/token',
          method: 'POST',
          data: {
            grant_type: 'client_credentials',
            client_id: 'KT1upIDxMSBieftQaPdwXLip',
            client_secret: 'Upw2Q4dbdPfCmEXM1blNJk8sdGjI37eu'
          }
        })
        
        if (response.statusCode === 200) {
          return response.data.access_token
        } else {
          throw new Error('获取token失败')
        }
      } catch (error) {
        throw error
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

.upload-section {
  margin-bottom: 30rpx;
}

.upload-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  border: 2rpx dashed #ff4081;
  transition: all 0.3s ease;
  min-height: 400rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-card:active {
  border-color: #ff80ab;
  background: rgba(255, 255, 255, 0.9);
}

.preview-image {
  width: 100%;
  height: 400rpx;
  border-radius: 20rpx;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 80rpx;
  color: #ff4081;
  margin-bottom: 20rpx;
}

.upload-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.upload-tip {
  font-size: 24rpx;
  color: #999;
}

.text-input-section {
  margin-bottom: 30rpx;
}

.chat-input {
  width: 100%;
  height: 300rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  border: 2rpx solid #f0f0f0;
}

.chat-input:focus {
  border-color: #ff4081;
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

.section-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
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