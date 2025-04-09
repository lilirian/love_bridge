<template>
	<view class="chat-detail-container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<text class="back" @tap="goBack">返回</text>
			<text class="title">{{chatInfo.username}}</text>
		</view>
		
		<!-- 聊天内容区域 -->
		<scroll-view class="chat-content" scroll-y :scroll-top="scrollTop" @scrolltoupper="loadMoreMessages">
			<view class="message-list">
				<view v-for="(item, index) in messageList" :key="index" 
					:class="['message-item', item.isSelf ? 'self' : 'other']">
					<image :src="item.avatar" class="avatar"></image>
					<view class="message-content">
						<text class="message-text">{{item.content}}</text>
						<text class="message-time">{{item.time}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 底部输入区域 -->
		<view class="input-area">
			<input type="text" v-model="inputMessage" 
				class="message-input" 
				placeholder="输入消息..." 
				@confirm="sendMessage"/>
			<button class="send-btn" @tap="sendMessage">发送</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			chatInfo: {
				username: '匹配用户',
				avatar: '/static/images/default-avatar.png'
			},
			messageList: [],
			inputMessage: '',
			scrollTop: 0
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		sendMessage() {
			if (!this.inputMessage.trim()) return
			
			const message = {
				content: this.inputMessage,
				time: this.formatTime(new Date()),
				isSelf: true,
				avatar: '/static/images/my-avatar.png'
			}
			
			this.messageList.push(message)
			this.inputMessage = ''
			this.scrollToBottom()
			
			// TODO: 发送消息到服务器
		},
		loadMoreMessages() {
			// TODO: 加载更多历史消息
		},
		scrollToBottom() {
			setTimeout(() => {
				this.scrollTop = 9999999
			}, 100)
		},
		formatTime(date) {
			const hour = date.getHours().toString().padStart(2, '0')
			const minute = date.getMinutes().toString().padStart(2, '0')
			return `${hour}:${minute}`
		}
	}
}
</script>

<style lang="scss">
.chat-detail-container {
	min-height: 100vh;
	background-color: #fafafa;
	display: flex;
	flex-direction: column;
	
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
	
	.chat-content {
		flex: 1;
		padding: 20rpx;
		
		.message-list {
			.message-item {
				display: flex;
				margin-bottom: 30rpx;
				
				&.self {
					flex-direction: row-reverse;
					
					.message-content {
						margin-right: 20rpx;
						margin-left: 0;
						
						.message-text {
							background-color: #FFB6C1;
							color: #ffffff;
						}
					}
				}
				
				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}
				
				.message-content {
					margin-left: 20rpx;
					max-width: 60%;
					
					.message-text {
						background-color: #ffffff;
						padding: 20rpx;
						border-radius: 20rpx;
						font-size: 28rpx;
						display: inline-block;
						word-break: break-all;
					}
					
					.message-time {
						font-size: 24rpx;
						color: #999;
						margin-top: 10rpx;
						display: block;
					}
				}
			}
		}
	}
	
	.input-area {
		padding: 20rpx;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		border-top: 1rpx solid #eee;
		
		.message-input {
			flex: 1;
			height: 72rpx;
			background-color: #f5f5f5;
			border-radius: 36rpx;
			padding: 0 30rpx;
			font-size: 28rpx;
			margin-right: 20rpx;
		}
		
		.send-btn {
			width: 120rpx;
			height: 72rpx;
			background: linear-gradient(45deg, #FFB6C1, #FF69B4);
			color: #ffffff;
			border-radius: 36rpx;
			font-size: 28rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style> 