<template>
	<view class="login-container">
		<view class="login-header">
			<text class="title">欢迎回来</text>
			<text class="subtitle">登录您的账号</text>
		</view>
		
		<view class="login-form">
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
			
			<button 
				class="login-btn" 
				@tap="handleLogin"
				:disabled="loading"
			>
				{{ loading ? '登录中...' : '登录' }}
			</button>
			
			<view class="register-link">
				<text>还没有账号？</text>
				<text class="link" @tap="goToRegister">立即注册</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			email: '',
			password: '',
			loading: false
		}
	},
	methods: {
		async handleLogin() {
			if (!this.email || !this.password) {
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				})
				return
			}
			
			this.loading = true
			try {
				const response = await uni.request({
					url: 'http://localhost:8000/api/auth/login/',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					data: {
						email: this.email,
						password: this.password
					}
				})
				
				if (response.statusCode === 200) {
					// 保存token和用户信息
					uni.setStorageSync('access_token', response.data.tokens.access)
					uni.setStorageSync('refresh_token', response.data.tokens.refresh)
					uni.setStorageSync('user_info', response.data.user)
					
					// 更新全局用户状态
					this.$store.commit('setUserInfo', response.data.user)
					this.$store.commit('setIsLoggedIn', true)
					
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					})
					
					// 获取用户详细信息
					try {
						const userResponse = await uni.request({
							url: 'http://localhost:8000/api/user/profile/',
							method: 'GET',
							header: {
								'Authorization': `Bearer ${response.data.tokens.access}`,
								'Accept': 'application/json'
							}
						})
						
						if (userResponse.statusCode === 200) {
							// 保存用户详细信息
							uni.setStorageSync('user_profile', userResponse.data)
							this.$store.commit('setUserProfile', userResponse.data)
						}
					} catch (error) {
						console.error('获取用户信息失败:', error)
					}
					
					// 跳转到首页
					uni.reLaunch({
						url: '/pages/index/index'
					})
				} else {
					uni.showToast({
						title: response.data.error || '登录失败',
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
		goToRegister() {
			uni.navigateTo({
				url: '/pages/auth/register'
			})
		}
	}
}
</script>

<style lang="scss">
.login-container {
	padding: 40rpx;
	
	.login-header {
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
	
	.login-form {
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
		
		.login-btn {
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
		
		.register-link {
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