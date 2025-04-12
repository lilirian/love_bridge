<script>
import { mapMutations } from 'vuex'

export default {
	onLaunch: function() {
		console.log('App Launch')
		// 检查本地存储中是否有token
		const token = uni.getStorageSync('access_token')
		const userInfo = uni.getStorageSync('user_info')
		
		if (token && userInfo) {
			// 恢复登录状态
			this.setUserInfo(userInfo)
			this.setIsLoggedIn(true)
			this.setToken(token)
			
			// 验证token是否有效
			this.validateToken(token)
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
				
				if (response.statusCode === 200) {
					// token有效，更新用户信息
					this.setUserInfo(response.data)
					return true
				} else if (response.statusCode === 401) {
					// token过期，尝试刷新
					return await this.refreshToken()
				} else {
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
				const refreshToken = uni.getStorageSync('refresh_token')
				if (!refreshToken) {
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
				
				if (response.statusCode === 200) {
					// 刷新成功，更新token
					const newToken = response.data.access
					this.setToken(newToken)
					uni.setStorageSync('access_token', newToken)
					return true
				} else {
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
			this.logout()
			uni.removeStorageSync('access_token')
			uni.removeStorageSync('refresh_token')
			uni.removeStorageSync('user_info')
			uni.removeStorageSync('user_profile')
		}
	}
}
</script>

<style>
	/*每个页面公共css */
</style>
