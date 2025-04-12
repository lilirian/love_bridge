<script>
import { mapMutations } from 'vuex'

export default {
	onLaunch: function() {
		console.log('App Launch')
		// 检查本地存储中是否有token
		const token = uni.getStorageSync('access_token')
		const userInfo = uni.getStorageSync('user_info')
		
		console.log('启动时token状态:', token ? '存在' : '不存在')
		console.log('启动时userInfo状态:', userInfo ? '存在' : '不存在')
		
		if (token && userInfo) {
			console.log('尝试恢复登录状态')
			// 恢复登录状态
			this.setUserInfo(userInfo)
			this.setIsLoggedIn(true)
			this.setToken(token)
			
			// 验证token是否有效
			this.validateToken(token)
		} else {
			console.log('未找到有效的登录信息，需要重新登录')
		}
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	},
	methods: {
		...mapMutations(['setUserInfo', 'setIsLoggedIn', 'logout', 'setToken']),
		async validateToken(token) {
			try {
				console.log('开始验证token')
				const response = await uni.request({
					url: 'http://localhost:8000/api/user/profile/',
					method: 'GET',
					header: {
						'Authorization': `Bearer ${token}`,
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					timeout: 5000,
					withCredentials: true
				})
				
				console.log('token验证响应状态码:', response.statusCode)
				
				if (response.statusCode === 200) {
					console.log('token验证成功')
					// token有效，更新用户信息
					this.setUserInfo(response.data)
					return true
				} else if (response.statusCode === 401) {
					console.log('token已过期，尝试刷新')
					// token过期，尝试刷新
					return await this.refreshToken()
				} else {
					console.log('token验证失败，状态码:', response.statusCode)
					// 其他错误，清除登录状态
					this.clearLoginState()
					return false
				}
			} catch (error) {
				console.error('验证token失败:', error)
				// 网络错误，不清除登录状态，让用户继续使用
				return false
			}
		},
		async refreshToken() {
			try {
				console.log('开始刷新token')
				const refreshToken = uni.getStorageSync('refresh_token')
				if (!refreshToken) {
					console.log('未找到refresh_token')
					this.clearLoginState()
					return false
				}
				
				const response = await uni.request({
					url: 'http://localhost:8000/api/user/token/refresh/',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					data: {
						refresh: refreshToken
					},
					withCredentials: true
				})
				
				console.log('token刷新响应状态码:', response.statusCode)
				
				if (response.statusCode === 200) {
					console.log('token刷新成功')
					// 刷新成功，更新token
					const newToken = response.data.access
					this.setToken(newToken)
					uni.setStorageSync('access_token', newToken)
					return true
				} else {
					console.log('token刷新失败，状态码:', response.statusCode)
					this.clearLoginState()
					return false
				}
			} catch (error) {
				console.error('刷新token失败:', error)
				this.clearLoginState()
				return false
			}
		},
		clearLoginState() {
			console.log('清除登录状态')
			this.logout()
			uni.removeStorageSync('access_token')
			uni.removeStorageSync('refresh_token')
			uni.removeStorageSync('user_info')
			uni.removeStorageSync('user_profile')
			console.log('登录状态已清除')
		}
	}
}
</script>

<style>
	/*每个页面公共css */
</style>
