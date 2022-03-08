import Vue from "vue";
import Vuex from "vuex"
import {getRequest} from "@/utils/api";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import {Notification} from 'element-ui';

Vue.use(Vuex)

/**
 * 配置vuex
 * 配置完成后需要去入口函数那里导入vuex
 */

// const now = new Date()

const store = new Vuex.Store({
    //state：一个全局对象，用于保存公共的组件
    state: {
        routes: [],
        sessions: {},
        admins: [],
        currentAdmin: JSON.parse(window.sessionStorage.getItem('user')),
        currentSession: null,
        filterKey: '',
        stomp: null,
        isDot: {}
    },
    //可以改变state里面值的方法，同步执行的方法
    mutations: {
        //初始化当前用户，修改当前用户信息的时候可能会用到
        INIT_ADMIN(state, admin) {
            state.currentAdmin = admin
        },
        // INIT_CURRENTADMIN(state,admin){
        //   state.currentAdmin = admin;
        // },
        initRoutes(state, data) {
            state.routes = data
        },
        changeCurrentSession(state, currentSession) {
            state.currentSession = currentSession;
            //关于未读消息的小红点，点中联系人，小红点消失
            Vue.set(state.isDot, state.currentAdmin.username + '#' + state.currentSession.username, false)
        },
        //保存消息的内容,消息的发送
        addMessage(state, msg) {
            let mss = state.sessions[state.currentAdmin.username + '#' + msg.to];
            if (!mss) {
                // state.sessions[state.currentAdmin.username + '#' + msg.to] = []
                Vue.set(state.sessions, state.currentAdmin.username + '#' + msg.to, [])
            }
            state.sessions[state.currentAdmin.username + '#' + msg.to].push({
                content: msg.content,
                date: new Date(),
                self: !msg.notSelf
            })
        },
        INIT_DATA(state) {
            // 浏览器本地聊天记录，聊天数据持久化
            let data = localStorage.getItem('vue-chat-session');
            //console.log(data)
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_ADMINS(state, data) {
            state.admins = data
        }
    },
    //异步执行的方法
    actions: {
        /**
         * 连接的后端接口代码在WebSocketConfig中
         * 消息格式ChatMsg
         * 发送消息控制器WsController
         * @param context
         */
        connect(context) {
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            /**
             * 建立连接需要得到令牌token
             */
            let token = window.sessionStorage.getItem('tokenStr')
            context.state.stomp.connect({'Auth-Token': token}, success => {
                //连接建立成功需要订阅消息,默认有一个前置路径user,监听频道
                context.state.stomp.subscribe('/user/queue/chat', msg => {
                    let receiveMsg = JSON.parse(msg.body);
                    //当前没有和任何人聊天的时候，或者当前聊天的对象不是新消息发送者
                    if (!context.state.currentSession || receiveMsg.from !== context.state.currentSession.username) {

                        Notification.info({
                            title: '【' + receiveMsg.fromNickName + '】发来一条消息',
                            message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) : receiveMsg.content,
                            position: 'bottom-right'
                        });
                        //关于未读消息的小红点
                        Vue.set(context.state.isDot, context.state.currentAdmin.username + '#' + receiveMsg.from, true)

                    }
                    receiveMsg.notSelf = true
                    receiveMsg.to = receiveMsg.from;
                    context.commit('addMessage', receiveMsg)
                })
            }, error => {

            })
        },
        initData(context) {
            //聊天消息持久化
            context.commit('INIT_DATA')
            getRequest('/chat/').then(resp => {
                if (resp) {
                    context.commit('INIT_ADMINS', resp)
                }
            })
        }
    }
})

/**
 * 监听聊天消息，将聊天消息进行持久化操作
 */
store.watch(function (state) {
    return state.sessions
}, function (val) {
    console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;