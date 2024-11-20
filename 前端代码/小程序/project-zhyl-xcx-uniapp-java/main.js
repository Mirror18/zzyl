import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
// import '@/utils/interceptor.js';
import NavBar from '@/components/Navbar/index.vue'
import NetFail from '@/components/NetFail/index.vue'
	// 底部导航
	import UniFooter from '@/components/Foot/index.vue';
// import Vue from 'vue'

const app = createApp(App)
app.use(store)
app.mount('#app')

app.component('nav-bar', NavBar);
app.component('uni-footer', UniFooter);
app.component('net-fail', NetFail);