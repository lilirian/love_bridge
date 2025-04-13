<template>
  <view class="profile-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="nav-title">个人资料</view>
    </view>

    <!-- 头像上传区域 -->
    <view class="avatar-section">
      <view class="avatar-wrapper" @click="chooseAvatar">
        <image class="avatar" :src="userInfo.avatar_url || '/static/images/default-avatar.png'" mode="aspectFill"></image>
        <view class="avatar-edit">
          <text class="edit-text">更换头像</text>
        </view>
      </view>
    </view>

    <!-- 基本信息表单 -->
    <view class="form-section">
      <view class="form-item">
        <text class="label">昵称</text>
        <input class="input" v-model="userInfo.nickname" placeholder="请输入昵称" />
      </view>

      <view class="form-item">
        <text class="label">性别</text>
        <picker class="picker" mode="selector" :range="genderOptions" :value="genderIndex" @change="onGenderChange">
          <view class="picker-value">{{ genderOptions[genderIndex] }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">出生日期</text>
        <picker class="picker" mode="date" :value="userInfo.birth_date" @change="onBirthDateChange">
          <view class="picker-value">{{ userInfo.birth_date || '请选择出生日期' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">所在地</text>
        <input class="input" v-model="userInfo.location" placeholder="请输入所在地" />
      </view>

      <view class="form-item">
        <text class="label">个人简介</text>
        <textarea class="textarea" v-model="userInfo.bio" placeholder="介绍一下自己吧" />
      </view>

      <view class="form-item">
        <text class="label">兴趣爱好</text>
        <input class="input" v-model="userInfo.interests" placeholder="请输入兴趣爱好，用逗号分隔" />
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="save-button" @click="saveProfile">
      <text class="save-text">保存修改</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        nickname: '',
        gender: 'M',
        birth_date: '',
        location: '',
        bio: '',
        interests: '',
        avatar_url: ''
      },
      genderOptions: ['男', '女'],
      genderIndex: 0
    }
  },
  onLoad() {
    this.getUserProfile()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    // 获取用户资料
    async getUserProfile() {
      try {
        const token = uni.getStorageSync('access_token')
        if (!token) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          uni.navigateTo({
            url: '/pages/auth/login'
          })
          return
        }

        const res = await uni.request({
          url: 'http://localhost:8000/api/user/profile/',
          method: 'GET',
          header: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.statusCode === 200) {
          this.userInfo = res.data
          this.genderIndex = this.userInfo.gender === 'M' ? 0 : 1
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('access_token')
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          })
          uni.navigateTo({
            url: '/pages/auth/login'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '获取资料失败',
          icon: 'none'
        })
      }
    },

    // 选择头像
    async chooseAvatar() {
      try {
        const token = uni.getStorageSync('access_token')
        if (!token) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          uni.navigateTo({
            url: '/pages/auth/login'
          })
          return
        }

        const res = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })
        
        if (res.tempFilePaths.length > 0) {
          const uploadRes = await uni.uploadFile({
            url: 'http://localhost:8000/api/user/users/upload_avatar/',
            filePath: res.tempFilePaths[0],
            name: 'avatar',
            header: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (uploadRes.statusCode === 200) {
            // 解析返回的数据
            let data
            try {
              data = JSON.parse(uploadRes.data)
            } catch (e) {
              console.error('解析返回数据失败:', e)
              data = uploadRes.data
            }
            
            // 更新头像URL
            if (data.avatar_url) {
              this.userInfo.avatar_url = data.avatar_url
            } else if (data.avatar) {
              this.userInfo.avatar_url = data.avatar
            }
            
            // 重新获取用户资料
            await this.getUserProfile()
            
            uni.showToast({
              title: '头像上传成功',
              icon: 'success'
            })
          } else if (uploadRes.statusCode === 401) {
            uni.removeStorageSync('access_token')
            uni.showToast({
              title: '登录已过期，请重新登录',
              icon: 'none'
            })
            uni.navigateTo({
              url: '/pages/auth/login'
            })
          } else {
            console.error('上传失败:', uploadRes)
            uni.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
        }
      } catch (error) {
        console.error('上传出错:', error)
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    },

    // 性别选择
    onGenderChange(e) {
      this.genderIndex = e.detail.value
      this.userInfo.gender = this.genderIndex === 0 ? 'M' : 'F'
    },

    // 出生日期选择
    onBirthDateChange(e) {
      this.userInfo.birth_date = e.detail.value
    },

    // 保存资料
    async saveProfile() {
      // 检查 token 是否存在
      const token = uni.getStorageSync('access_token')
      if (!token) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        uni.navigateTo({
          url: '/pages/auth/login'
        })
        return
      }

      // 数据验证
      if (!this.userInfo.nickname) {
        uni.showToast({
          title: '请输入昵称',
          icon: 'none'
        })
        return
      }

      if (!this.userInfo.birth_date) {
        uni.showToast({
          title: '请选择出生日期',
          icon: 'none'
        })
        return
      }

      // 准备发送的数据
      const postData = {
        nickname: this.userInfo.nickname,
        gender: this.userInfo.gender,
        birth_date: this.userInfo.birth_date,
        location: this.userInfo.location || '',
        bio: this.userInfo.bio || '',
        interests: this.userInfo.interests || ''
      }

      console.log('准备发送的数据:', postData)
      console.log('当前用户信息:', this.userInfo)

      try {
        console.log('开始发送请求...')
        const res = await uni.request({
          url: 'http://localhost:8000/api/user/profile/update/',
          method: 'POST',
          data: postData,
          header: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log('请求响应:', res)
        
        if (res.statusCode === 200) {
          console.log('保存成功，重新获取用户资料...')
          // 保存成功后重新获取用户资料
          await this.getUserProfile()
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          })
        } else if (res.statusCode === 401) {
          console.log('token 无效或过期')
          // token 无效或过期
          uni.removeStorageSync('access_token')
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          })
          uni.navigateTo({
            url: '/pages/auth/login'
          })
        } else {
          console.log('保存失败，错误信息:', res.data)
          // 显示具体的错误信息
          let errorMsg = '保存失败'
          if (res.data && res.data.detail) {
            errorMsg = res.data.detail
          } else if (res.data && res.data.message) {
            errorMsg = res.data.message
          } else if (res.data && typeof res.data === 'string') {
            errorMsg = res.data
          }
          uni.showToast({
            title: errorMsg,
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('保存出错:', error)
        uni.showToast({
          title: '保存失败，请检查网络',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #ffb6c1 100%);
  padding-bottom: 40rpx;
  position: relative;
  overflow: hidden;
}

.nav-bar {
  height: 88rpx;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  position: relative;
  backdrop-filter: blur(10px);
  
  .nav-back {
    position: absolute;
    left: 30rpx;
    
    .back-icon {
      font-size: 40rpx;
      color: #333;
    }
  }
  
  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
}

.avatar-section {
  padding: 40rpx;
  display: flex;
  justify-content: center;
  
  .avatar-wrapper {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
    border: 4rpx solid #fff;
    
    .avatar {
      width: 100%;
      height: 100%;
    }
    
    .avatar-edit {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60rpx;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
      
      .edit-text {
        color: #ffffff;
        font-size: 24rpx;
      }
    }
  }
}

.form-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30rpx;
  margin: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  
  .form-item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .input {
      height: 80rpx;
      font-size: 28rpx;
      color: #333;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 16rpx;
      padding: 0 20rpx;
    }
    
    .picker {
      height: 80rpx;
      
      .picker-value {
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        color: #333;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 16rpx;
        padding: 0 20rpx;
      }
    }
    
    .textarea {
      width: 100%;
      height: 200rpx;
      font-size: 28rpx;
      color: #333;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 16rpx;
      padding: 20rpx;
    }
  }
}

.save-button {
  margin: 40rpx 20rpx;
  height: 88rpx;
  background: linear-gradient(45deg, #ff4081, #ff80ab);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 20rpx rgba(255, 64, 129, 0.3);
  
  .save-text {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 500;
  }
}

// 添加装饰元素
.decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  
  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    animation: float 6s ease-in-out infinite;
    
    &.circle-1 {
      width: 300rpx;
      height: 300rpx;
      top: -50rpx;
      right: -50rpx;
      animation-delay: 0s;
    }
    
    &.circle-2 {
      width: 200rpx;
      height: 200rpx;
      bottom: -30rpx;
      left: -30rpx;
      animation-delay: 2s;
    }
    
    &.circle-3 {
      width: 150rpx;
      height: 150rpx;
      top: 40%;
      right: 15%;
      animation-delay: 4s;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20rpx);
  }
}
</style>
