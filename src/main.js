import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import { Message } from 'element-ui';
import store from './store/store'
// import Loading from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import moment from 'moment';

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;
axios.defaults.baseURL="http://localhost:8080";


Vue.filter('moment', function (value, formatString) {
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
    return moment(value).format(formatString); // 这是时间戳转时间
});


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    axios.post("/sys/menu/nav",null, {
    }).then((res) => {
        if (res.data != null){
            store.commit('init',res.data.permissions);
            // alert(11);
            alert(store.state.permissions);
        }else {

        }
    });


    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

//请求拦截
axios.interceptors.request.use(config=>{
    if (localStorage.token){
        config.headers.Authorization = localStorage.token;
        config.headers.token = localStorage.token;
    }
    return config;
},error => {
    return Promise.reject(error);
})


//响应拦截
axios.interceptors.response.use(response=>{
    let code = response.data.code;
    if (code == 401){
        Message.error("token过期，请重新登录");
        localStorage.removeItem("token");
        router.push('/login');
    }
    return response;
},error => {
    return Promise.reject(error);
})


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
