import { createStore } from 'vuex'

const store = createStore({
    state: {
        isLoggedIn: false,
        userInfo: null,
        userProfile: null,
        token: null
    },
    mutations: {
        setIsLoggedIn(state, status) {
            state.isLoggedIn = status
        },
        setUserInfo(state, info) {
            state.userInfo = info
        },
        setUserProfile(state, profile) {
            state.userProfile = profile
        },
        setToken(state, token) {
            state.token = token
        },
        logout(state) {
            state.isLoggedIn = false
            state.userInfo = null
            state.userProfile = null
            state.token = null
            uni.removeStorageSync('access_token')
            uni.removeStorageSync('refresh_token')
            uni.removeStorageSync('user_info')
            uni.removeStorageSync('user_profile')
        }
    },
    actions: {
        async fetchUserProfile({ commit, state }) {
            try {
                const token = uni.getStorageSync('access_token')
                if (!token) return

                const response = await uni.request({
                    url: 'http://localhost:8000/api/user/profile/',
                    method: 'GET',
                    header: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                })

                if (response.statusCode === 200) {
                    commit('setUserProfile', response.data)
                    uni.setStorageSync('user_profile', response.data)
                }
            } catch (error) {
                console.error('获取用户信息失败:', error)
            }
        }
    },
    getters: {
        isAuthenticated: state => state.isLoggedIn,
        currentUser: state => state.userInfo,
        userProfile: state => state.userProfile
    }
})

export default store 