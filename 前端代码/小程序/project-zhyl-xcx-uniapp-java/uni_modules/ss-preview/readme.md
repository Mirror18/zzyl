# ss-preview

### 在线预览文档（pdf)，图片和视频,如果想预览doc,docx,xls,xlsx等文档可通过服务端转换成pdf文件流实现预览，例如
##  此处仅为.doc,.docx,.xls,.xlsx示例，通过服务端接口把相关文件转换为pdf文件流
##  把doc等链接通过https://xxxx接口传参转为浏览器可识别的文件流 `https://xxxx?file==${encodeURIComponent('http://xxxx.doc')}`	
 
### 不清楚使用方式可点击右侧导入示例项目运行完整示例

## 使用说明
| 属性		| 是否必填	|  值类型	| 默认值	| 说明			|
| --------- | -------- 	| -----: 	| --: 	| :------------:|
| fileUrl	|	否 		| String	|空	    | 预览单个文档或视频传递url		|
| fileType	|	是 		| String	|空	    | 类型（1.预览图片，2.预览文件，3.预览视频）		|
| imageList	|	否 		| Array	    |空数组  | 预览单个或多个图片传递数组 |
###图片支持多张预览，所以传递数组进去


## 注意事项
### 小程序端因hybrid不能使用本地HTML，所以插件提供的是从微信官方方法uni.downloadFile下载成功之后通过uni.openDocument打开，此方法兼容APP，在APP上打开的效果是调用系统相关应用打开，无相关应用则不能打开 不兼容H5。
### APP预览视频要在manifest.json-App模块配置里面勾选VideoPlayer(视频播放)
### 预览图片也可以使用uni-app的方法uni.previewImage实现预览，可以视需求而定
### 预览视频也可以直接使用video标签，但是video为原生组件，层级较高，在APP滑动的界面可能会产生兼容性问题，所以我这边是单独提取出来，使用者可以视需求而定