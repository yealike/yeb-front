import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//引入vuex相关组件
import store from "@/store";
import router from "@/router";
import {postRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {initMenu} from "@/utils/menus";
//导入font-awesome-css
import 'font-awesome/css/font-awesome.css'
import {downloadRequest} from "@/utils/download";


Vue.config.productionTip = false
//全局样式设置
Vue.use(ElementUI, {size: 'small'})

// 以插件的形式去引用组件
Vue.prototype.postRequest = postRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.downloadRequest = downloadRequest

/**
 * 路由前置守卫
 * 如果用户登录了就去初始化菜单，如果没有跳转去登录页
 */
router.beforeEach((to, from, next) => {
    if (window.sessionStorage.getItem('tokenStr')) {
        initMenu(router, store)
        //判断用户的信息是否存在
        if (!window.sessionStorage.getItem('user')) {
            return getRequest('/admin/info').then(resp => {
                if (resp) {
                    //因为sessionStorage中只能存放字符串，所以要将返回信息转为字符串,存入用户信息
                    window.sessionStorage.setItem('user', JSON.stringify(resp))
                    // //消息发送与接收时需要用到
                    // store.commit('INIT_CURRENTADMIN', resp)

                    // 修改用户信息时需要进行更新
                    store.commit('INIT_ADMIN',resp)
                    next()

                }
            })
        }
        next()
    } else {
        if (to.path === '/') {
            next()
        } else {
            next('/?redirect=' + to.path)
        }
    }


})

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
