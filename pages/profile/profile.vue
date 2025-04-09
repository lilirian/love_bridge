<template>
  <view class="profile-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="back" @tap="goBack">返回</text>
      <text class="title">个人资料优化</text>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 基本信息输入 -->
      <view class="input-section" v-if="!optimizedProfile">
        <view class="input-card">
          <text class="input-title">基本信息</text>
          <view class="input-item">
            <text class="label">昵称</text>
            <input type="text" v-model="basicInfo.nickname" placeholder="请输入你的昵称" />
          </view>
          <view class="input-item">
            <text class="label">年龄</text>
            <input type="number" v-model="basicInfo.age" placeholder="请输入你的年龄" />
          </view>
          <view class="input-item">
            <text class="label">性别</text>
            <picker mode="selector" :range="genderOptions" @change="onGenderChange">
              <view class="picker-value">{{basicInfo.gender || '请选择性别'}}</view>
            </picker>
          </view>
          <view class="input-item">
            <text class="label">城市</text>
            <input type="text" v-model="basicInfo.city" placeholder="请输入你的城市" />
          </view>
        </view>

        <view class="input-card">
          <text class="input-title">兴趣爱好</text>
          <view class="interest-input">
            <input 
              type="text" 
              v-model="interestInput" 
              placeholder="输入兴趣后按回车添加"
              @confirm="addInterest"
            />
            <view class="interest-tags">
              <view class="tag" v-for="(item, index) in basicInfo.interests" :key="index">
                <text>{{item}}</text>
                <text class="delete" @tap="removeInterest(index)">×</text>
              </view>
            </view>
          </view>
        </view>

        <view class="input-card">
          <text class="input-title">个人介绍</text>
          <textarea 
            class="bio-input" 
            v-model="basicInfo.bio" 
            placeholder="请描述一下你自己，包括性格特点、生活习惯、理想等..."
            maxlength="500"
          ></textarea>
          <text class="input-count">{{basicInfo.bio.length}}/500</text>
        </view>

        <view class="input-card">
          <text class="input-title">上传照片</text>
          <view class="photo-upload">
            <view class="photo-list">
              <view 
                class="photo-item" 
                v-for="(item, index) in basicInfo.photos" 
                :key="index"
              >
                <image :src="item" mode="aspectFill"></image>
                <text class="delete" @tap="removePhoto(index)">×</text>
              </view>
              <view class="photo-item add" @tap="chooseImage" v-if="basicInfo.photos.length < 6">
                <text class="icon">+</text>
              </view>
            </view>
            <text class="photo-tip">最多上传6张照片</text>
          </view>
        </view>

        <button class="optimize-btn" @tap="startOptimize">开始优化</button>
      </view>

      <!-- 优化结果展示 -->
      <view class="result-section" v-else>
        <view class="result-card">
          <text class="card-title">优化建议</text>
          <view class="suggestion-list">
            <view class="suggestion-item" v-for="(item, index) in optimizedProfile.suggestions" :key="index">
              <text class="item-number">{{index + 1}}</text>
              <text class="item-text">{{item}}</text>
            </view>
          </view>
        </view>

        <view class="result-card">
          <text class="card-title">优化后的个人介绍</text>
          <view class="optimized-bio">
            <text class="bio-text">{{optimizedProfile.bio}}</text>
          </view>
        </view>

        <view class="result-card">
          <text class="card-title">关键词提取</text>
          <view class="keyword-tags">
            <text class="tag" v-for="(item, index) in optimizedProfile.keywords" :key="index">{{item}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作区 -->
    <view class="footer" v-if="optimizedProfile">
      <button class="action-btn" @tap="resetOptimize">重新优化</button>
      <button class="action-btn primary" @tap="saveProfile">保存资料</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      genderOptions: ['男', '女'],
      interestInput: '',
      basicInfo: {
        nickname: '',
        age: '',
        gender: '',
        city: '',
        interests: [],
        bio: '',
        photos: []
      },
      optimizedProfile: null
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    onGenderChange(e) {
      this.basicInfo.gender = this.genderOptions[e.detail.value]
    },
    addInterest(e) {
      const value = e.detail.value.trim()
      if (value && !this.basicInfo.interests.includes(value)) {
        this.basicInfo.interests.push(value)
      }
      this.interestInput = ''
    },
    removeInterest(index) {
      this.basicInfo.interests.splice(index, 1)
    },
    chooseImage() {
      // TODO: 实现图片选择功能
      this.basicInfo.photos.push('/static/images/default-avatar.png')
    },
    removePhoto(index) {
      this.basicInfo.photos.splice(index, 1)
    },
    startOptimize() {
      if (!this.validateBasicInfo()) {
        return
      }
      
      // 模拟优化结果
      this.optimizedProfile = {
        suggestions: [
          '建议在个人介绍中突出你的性格特点',
          '可以添加一些具体的兴趣爱好描述',
          '建议增加一些生活目标的描述',
          '可以适当添加一些幽默元素'
        ],
        bio: '热爱生活、积极向上的90后，喜欢旅行和摄影，记录生活中的美好瞬间。性格开朗，善于沟通，喜欢结交新朋友。希望能找到一个志同道合的伴侣，一起分享生活的点点滴滴。',
        keywords: ['开朗', '热爱生活', '旅行', '摄影', '善于沟通']
      }
    },
    validateBasicInfo() {
      if (!this.basicInfo.nickname) {
        uni.showToast({
          title: '请输入昵称',
          icon: 'none'
        })
        return false
      }
      if (!this.basicInfo.age) {
        uni.showToast({
          title: '请输入年龄',
          icon: 'none'
        })
        return false
      }
      if (!this.basicInfo.gender) {
        uni.showToast({
          title: '请选择性别',
          icon: 'none'
        })
        return false
      }
      if (!this.basicInfo.city) {
        uni.showToast({
          title: '请输入城市',
          icon: 'none'
        })
        return false
      }
      if (!this.basicInfo.bio) {
        uni.showToast({
          title: '请输入个人介绍',
          icon: 'none'
        })
        return false
      }
      return true
    },
    resetOptimize() {
      this.optimizedProfile = null
    },
    saveProfile() {
      uni.showToast({
        title: '个人资料已保存',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss">
.profile-container {
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
      margin-bottom: 30rpx;
      display: block;
    }
    
    .input-item {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        width: 120rpx;
        font-size: 28rpx;
        color: #666;
      }
      
      input {
        flex: 1;
        height: 80rpx;
        background-color: #f5f5f5;
        border-radius: 20rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #333;
      }
      
      .picker-value {
        flex: 1;
        height: 80rpx;
        background-color: #f5f5f5;
        border-radius: 20rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #333;
        line-height: 80rpx;
      }
    }
    
    .interest-input {
      input {
        width: 100%;
        height: 80rpx;
        background-color: #f5f5f5;
        border-radius: 20rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
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
          display: flex;
          align-items: center;
          
          .delete {
            margin-left: 10rpx;
            font-size: 32rpx;
          }
        }
      }
    }
    
    .bio-input {
      width: 100%;
      height: 300rpx;
      background-color: #f5f5f5;
      border-radius: 20rpx;
      padding: 20rpx;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .input-count {
      font-size: 24rpx;
      color: #999;
      text-align: right;
      display: block;
    }
    
    .photo-upload {
      .photo-list {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -10rpx;
        
        .photo-item {
          width: calc(33.33% - 20rpx);
          height: 200rpx;
          margin: 10rpx;
          border-radius: 20rpx;
          overflow: hidden;
          position: relative;
          
          image {
            width: 100%;
            height: 100%;
          }
          
          .delete {
            position: absolute;
            top: 10rpx;
            right: 10rpx;
            width: 40rpx;
            height: 40rpx;
            background-color: rgba(0,0,0,0.5);
            color: #ffffff;
            border-radius: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32rpx;
          }
          
          &.add {
            background-color: #f5f5f5;
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
      
      .photo-tip {
        font-size: 24rpx;
        color: #999;
        margin-top: 20rpx;
        display: block;
      }
    }
  }
  
  .optimize-btn {
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
    
    .optimized-bio {
      .bio-text {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
      }
    }
    
    .keyword-tags {
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