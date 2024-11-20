// 页面白名单，不受拦截
const whiteList = [
	'/pages/login/index',
	'/pages/index/index',
	'/pages/my/index'
]
let token = uni.getStorageSync('token')//在这可以使用token,isLogin是登录成功后在本地存储登录标识
function hasPermission (url) {
	// console.log(url)
    if(whiteList.indexOf(url) !== -1 || token!=='') {
        return true
    }
    return false
}
uni.addInterceptor('navigateTo', {
    // 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
    invoke (e) {
        if(!hasPermission(e.url)){
            uni.reLaunch({
                url: '/pages/login/index'
            })
            return false
        }
        return true
    },
    success (e) {
		
    }
})
let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
list.forEach(item => {
	uni.addInterceptor(item, {
		invoke (e) {
			console.log(e)
		}
	})
})
// uni.addInterceptor("switchTab", {
//   // tabbar页面跳转前进行拦截
//   invoke(e) {
// 		console.log(e)
//     if (!hasPermission(e.url)) {
//       uni.reLaunch({
//         url: "/pages/login/index",
//       });
//       return false;
//     }
//     return true;
//   },
//   success(e) {
//     console.log(e)
//   },
// });