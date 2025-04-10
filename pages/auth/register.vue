<template>
	<view class="register-container">
		<view class="register-header">
			<text class="title">创建账号</text>
			<text class="subtitle">加入AI恋爱助手</text>
		</view>
		
		<view class="register-form">
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
				<text class="label">用户名</text>
				<input 
					type="text" 
					v-model="username" 
					placeholder="请输入用户名"
					class="input"
				/>
			</view>
			
			<view class="input-group">
				<text class="label">密码</text>
				<input 
					type="password" 
					v-model="password" 
					placeholder="请输入密码（至少6位）"
					class="input"
				/>
			</view>
			
			<view class="input-group">
				<text class="label">确认密码</text>
				<input 
					type="password" 
					v-model="password2" 
					placeholder="请再次输入密码"
					class="input"
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
			email: '',
			username: '',
			password: '',
			password2: '',
			loading: false
		}
	},
	methods: {
		async handleRegister() {
			if (!this.email || !this.username || !this.password || !this.password2) {
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				})
				return
			}
			
			if (this.password !== this.password2) {
				uni.showToast({
					title: '两次输入的密码不一致',
					icon: 'none'
				})
				return
			}
			
			if (this.password.length < 6) {
				uni.showToast({
					title: '密码长度不能少于6位',
					icon: 'none'
				})
				return
			}
			
			this.loading = true
			try {
				const response = await uni.request({
					url: 'http://localhost:8000/api/auth/register/',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					data: {
						email: this.email,
						username: this.username,
						password: this.password,
						password2: this.password2
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
					uni.switchTab({
						url: '/pages/index/index'
					})
				} else {
					let errorMsg = '注册失败'
					if (response.data.email) {
						errorMsg = response.data.email[0]
					} else if (response.data.password) {
						errorMsg = response.data.password[0]
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