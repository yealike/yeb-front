/**
 * 封装请求
 * 返回错误信息的时候，在哪里发生错误就要在哪里显示错误信息
 * 使用elementUI的message消息提示
 *
 */
import axios from "axios";
import {Message} from "element-ui";
import router from "@/router";

/**
 * 请求拦截器，用来拦截前端给后端的请求，设置token处理认证和授权相关的问题
 */
axios.interceptors.request.use(config => {
    //如果存在token，请求携带这个token
    if (window.sessionStorage.getItem('tokenStr')) {
        config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr')
    }
    return config
}, error => {
    console.log(error)
})

/**
 * 配置响应拦截器
 */
axios.interceptors.response.use(success => {
    /**
     * 业务逻辑错误,说明前端的请求已经传达到后端，但是不符合业务逻辑
     * 在后端定义的通用返回结果中，有三个信息
     * code:状态码
     * message:响应消息
     * Object:封装对象
     */

    if (success.status && success.status === 200) {
        //由于是在学习阶段没能判断所有的响应状态码，默认除此之外的所有响应状态码都表示成功且符合业务逻辑
        if (success.data.code === 500 || success.data.code === 401 || success.data.code === 403) {
            Message.error({message: success.data.message})
            return
        }
        if (success.data.message) {
            Message.success({message: success.data.message})
        }
    }
    //如果没有其他问题，需要将后端响应的数据返回
    return success.data
}, error => {
    //这个就是完全的错误，前端请求未能访问到后端数据
    if (error.response.code === 504 || error.response.code === 404) {
        Message.error({message: '服务器被吃了o(╯□╰)o'})
    } else if (error.response.code === 403) {
        Message.error({message: '权限不足，请联系管理员'})
    } else if (error.response.code === 401) {
        //401表示未登录，需要跳转到登录页面
        router.replace('/')
    } else {
        if (error.response.data().message) {
            Message.error({message: error.response.data().message})
        } else {
            Message.error({message: '未知错误！'})
        }
    }
    return
})


//前置路径
let base = ''

/**
 * 传送json格式的post请求
 */
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}

/**
 * 传送json格式的put请求
 */
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

/**
 * 传送json格式的get请求
 */
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

/**
 * 传送json格式的delete请求
 */
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}