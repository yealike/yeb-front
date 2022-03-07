import Vue from "vue";
import Vuex from "vuex"
import {getRequest} from "@/utils/api";

Vue.use(Vuex)

/**
 * 配置vuex
 * 配置完成后需要去入口函数那里导入vuex
 */

const now = new Date()

const store = new Vuex.Store({
    //state：一个全局对象，用于保存公共的组件
    state: {
        routes: [],
        sessions: [],
        admins: [],
        currentSessionId: -1,
        filterKey: ''
    },
    //可以改变state里面值的方法，同步执行的方法
    mutations: {
        initRoutes(state, data) {
            state.routes = data
        },
        changeCurrentSessionId(state, id) {
            state.currentSessionId = id;
        },
        addMessage(state, msg) {
            state.sessions[state.currentSessionId - 1].messages.push({
                content: msg,
                date: new Date(),
                self: true
            })
        },
        INIT_DATA(state) {
            //浏览器本地聊天记录
            // let data = localStorage.getItem('vue-chat-session');
            // //console.log(data)
            // if (data) {
            //     state.sessions = JSON.parse(data);
            // }
        },
        INIT_ADMINS(state, data) {
            state.admins = data
        }
    },
    //异步执行的方法
    actions: {
        initData(context) {
            getRequest('/chat/').then(resp => {
                if (resp) {
                    context.commit('INIT_ADMINS', resp)
                }
            })
        }
    }
})

store.watch(function (state) {
    return state.sessions
}, function (val) {
    console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;