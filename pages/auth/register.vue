<template>
	<view class="register-container">
		<view class="register-header">
			<text class="title">创建账号</text>
			<text class="subtitle">加入恋爱桥</text>
		</view>
		
		<view class="register-form">
			<view class="input-group">
				<text class="label">用户名</text>
				<input 
					type="text" 
					v-model="username" 
					placeholder="请输入用户名"
					class="input"
				/>
			</view>
			
			<view class="input-group">
				<text class="label">邮箱</text>
				<input 
					type="text" 
					v-model="email" 
					placeholder="请输入邮箱"
					class="input"
				/>
			</view>
			
			<view class="input-group">
				<text class="label">密码</text>
				<input 
					type="password" 
					v-model="password" 
					placeholder="请输入密码"
					class="input"
				/>
			</view>
			
			<view class="input-group">
				<text class="label">性别</text>
				<picker 
					:range="genderOptions" 
					:value="genderIndex" 
					@change="handleGenderChange"
					class="picker"
				>
					<view class="picker-value">
						{{ genderOptions[genderIndex] }}
					</view>
				</picker>
			</view>
			
			<view class="input-group">
				<text class="label">出生日期</text>
				<picker 
					mode="date" 
					:value="birthDate" 
					@change="handleBirthDateChange"
					class="picker"
				>
					<view class="picker-value">
						{{ birthDate || '请选择出生日期' }}
					</view>
				</picker>
			</view>
			
			<view class="input-group">
				<text class="label">个人简介</text>
				<textarea 
					v-model="bio" 
					placeholder="介绍一下你自己吧"
					class="textarea"
				/>
			</view>
			
			<button 
				class="register-btn" 
				@tap="handleRegister"
				:disabled="loading"
			>
				{{ loading ? '注册中...' : '注册' }}
			</button>
			
			<view class="login-link">
				<text>已有账号？</text>
				<text class="link" @tap="goToLogin">立即登录</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			username: '',
			email: '',
			password: '',
			gender: 'M',
			genderIndex: 0,
			genderOptions: ['男', '女'],
			birthDate: '',
			bio: '',
			loading: false
		}
	},
	methods: {
		handleGenderChange(e) {
			this.genderIndex = e.detail.value
			this.gender = this.genderIndex === 0 ? 'M' : 'F'
		},
		handleBirthDateChange(e) {
			this.birthDate = e.detail.value
		},
		async handleRegister() {
			if (!this.username || !this.email || !this.password || !this.birthDate) {
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				})
				return
			}
			
			this.loading = true
			try {
				const response = await uni.request({
					url: 'http://127.0.0.1:8000/api/user/register/',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					data: {
						username: this.username,
						email: this.email,
						password: this.password,
						gender: this.gender,
						birth_date: this.birthDate,
						bio: this.bio || ''
					}
				})
				
				if (response.statusCode === 201) {
					// 保存token和用户信息
					uni.setStorageSync('access_token', response.data.tokens.access)
					uni.setStorageSync('refresh_token', response.data.tokens.refresh)
					uni.setStorageSync('user_info', response.data.user)
					
					uni.showToast({
						title: '注册成功',
						icon: 'success'
					})
					
					// 跳转到首页
					uni.reLaunch({
						url: '/pages/index/index'
					})
				} else {
					let errorMsg = '注册失败'
					if (response.data.username) {
						errorMsg = response.data.username[0]
					} else if (response.data.email) {
						errorMsg = response.data.email[0]
					} else if (response.data.password) {
						errorMsg = response.data.password[0]
					} else if (response.data.detail) {
						errorMsg = response.data.detail
					}
					uni.showToast({
						title: errorMsg,
						icon: 'none'
					})
				}
			} catch (error) {
				uni.showToast({
					title: '网络错误，请稍后重试',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		goToLogin() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss">
.register-container {
	padding: 40rpx;
	
	.register-header {
		margin-bottom: 60rpx;
		
		.title {
			font-size: 48rpx;
			font-weight: bold;
			color: #333;
			display: block;
			margin-bottom: 10rpx;
		}
		
		.subtitle {
			font-size: 28rpx;
			color: #666;
		}
	}
	
	.register-form {
		.input-group {
			margin-bottom: 30rpx;
			
			.label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 10rpx;
				display: block;
			}
			
			.input {
				width: 100%;
				height: 88rpx;
				background: #F5F5F5;
				border-radius: 44rpx;
				padding: 0 30rpx;
				font-size: 28rpx;
			}
			
			.picker {
				width: 100%;
				height: 88rpx;
				background: #F5F5F5;
				border-radius: 44rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				
				.picker-value {
					font-size: 28rpx;
					color: #333;
				}
			}
			
			.textarea {
				width: 100%;
				height: 200rpx;
				background: #F5F5F5;
				border-radius: 20rpx;
				padding: 20rpx;
				font-size: 28rpx;
			}
		}
		
		.register-btn {
			width: 100%;
			height: 88rpx;
			background: #ff4081;
			color: #fff;
			border-radius: 44rpx;
			font-size: 32rpx;
			margin-top: 40rpx;
			
			&:disabled {
				opacity: 0.6;
			}
		}
		
		.login-link {
			text-align: center;
			margin-top: 30rpx;
			font-size: 28rpx;
			color: #666;
			
			.link {
				color: #ff4081;
				margin-left: 10rpx;
			}
		}
	}
}
</style> 