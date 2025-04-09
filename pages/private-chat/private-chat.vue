<template>
	<view class="private-chat-container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<text class="title">与你交流</text>
		</view>
		
		<!-- 聊天列表 -->
		<scroll-view class="chat-list" scroll-y>
			<view v-if="chatList.length === 0" class="empty-state">
				<image src="/static/images/empty-chat.png" mode="aspectFit" class="empty-image"></image>
				<text class="empty-text">还没有匹配到心仪的Ta哦~</text>
			</view>
			<view v-else class="chat-item" v-for="(item, index) in chatList" :key="index" @tap="enterChat(item)">
				<image :src="item.avatar" class="avatar"></image>
				<view class="chat-info">
					<text class="username">{{item.username}}</text>
					<text class="last-message">{{item.lastMessage}}</text>
				</view>
				<text class="time">{{item.time}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			chatList: []
		}
	},
	methods: {
		enterChat(item) {
			// 跳转到具体聊天页面
			uni.navigateTo({
				url: `/pages/chat-detail/chat-detail?id=${item.id}`
			})
		}
	}
}
</script>

<style lang="scss">
.private-chat-container {
	min-height: 100vh;
	background-color: #fafafa;
	
	.nav-bar {
		height: 88rpx;
		background: linear-gradient(45deg, #FFB6C1, #FF69B4);
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: var(--status-bar-height);
		
		.title {
			color: #ffffff;
			font-size: 36rpx;
			font-weight: bold;
			text-shadow: 2rpx 2rpx 4rpx rgba(0,0,0,0.2);
		}
	}
	
	.chat-list {
		height: calc(100vh - 88rpx - var(--status-bar-height));
		padding: 20rpx;
		
		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			
			.empty-image {
				width: 300rpx;
				height: 300rpx;
				margin-bottom: 30rpx;
			}
			
			.empty-text {
				color: #999;
				font-size: 28rpx;
			}
		}
		
		.chat-item {
			display: flex;
			align-items: center;
			padding: 20rpx;
			background-color: #ffffff;
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
			
			.avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			
			.chat-info {
				flex: 1;
				
				.username {
					font-size: 32rpx;
					color: #333;
					margin-bottom: 10rpx;
					display: block;
				}
				
				.last-message {
					font-size: 26rpx;
					color: #999;
				}
			}
			
			.time {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
}
</style> 