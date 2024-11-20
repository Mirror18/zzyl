<template>
	<view class="page">
		<!-- 预览图片 -->
		<swiper class="swiper" style="width:100%;height:calc(100vh - 44px);margin:0 auto;" v-if="fileType === '1'">
			<swiper-item v-for="(item,index) in imageList" :key="'key'+index">
				<image :src="item" style="width:100%;height:100%;" mode="aspectFit"></image>
			</swiper-item>
		</swiper>
		<!-- 预览文件 -->
		<web-view :webview-styles="webviewStyles" :src="src" v-if="fileType === '2'"></web-view>
		<!-- 预览视频 -->
		<view class="video-detail-page" v-if="fileType === '3'">
			<view class="video-box">
				<video :src="fileUrl" controls></video>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ss-preview',
		props: {
			fileUrl: {
				type: String,
				default: ''
			},
			fileType: {
				type: String,
				default: '', //1.预览图片，2.预览文件，3.预览视频
			},
			imageList:{//预览图片，可以预览多张
				type: Array,
				default:()=>{
					return []
				}
			},
		},
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				src: '',
			};
		},
		methods: {
			//微信小程序预览文档,可预览.doc,.docx,.xls,.xlsx,.pdf等文件
			previewWechat(urlPdf) {
				uni.showLoading({
					title: '正在努力加载中..'
				})
				uni.downloadFile({
					url: urlPdf,
					success: function(res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							showMenu: true,
							success: function(res) {
								console.log('打开文档成功');
								uni.hideLoading()
							},
						});
					},
					complete: function(r) {
						uni.hideLoading()
					}
				});
			},
			//APP，H5预览文档图片和视频，微信小程序预览图片和视频
			previewPdf(value) {
				this.src = `/uni_modules/ss-preview/hybrid/html/pdf-reader/index.html?file=${encodeURIComponent(value)}`;		
			},
		},
		watch: {
			fileType: {
				deep: true,
				immediate: true,
				handler: function(value) {
					if(value === '2'){//预览文档
						//#ifdef APP-PLUS || H5
						this.previewPdf(this.fileUrl)
						//#endif
						//#ifdef MP-WEIXIN
						console.log(333)
						this.previewWechat(this.fileUrl)
						//#endif
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.page {
		height: 100%;

		.video-detail-page {
			width: 100%;

			uni-video {
				width: 100%;
			}

			video {
				width: 100%;
			}
		}
	}
</style>
