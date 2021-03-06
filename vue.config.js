/**
 * 处理请求跨域问题
 * 通过nodejs的代理转发到指定服务器
 */


let proxyObj = {}

proxyObj['/'] = {//代理包含 / 信息的路径
    //websocket
    ws: false,

    //代理到哪里去-->后端
    target: 'http://localhost:8081',
    //发送请求的请求头host会被设置target
    changeOrigin: true,
    //不重写请求地址
    pathRewrite: {
        '^/': '/'
    }

}

/**
 * 请求转发
 * 在一开始登录首页的时候就建立websocket连接，去vuex里面写连接的方法
 */
proxyObj['/ws'] = {
    ws: true,
    target: 'ws://localhost:8081'
}

module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj,
        overlay: {
            warnings: false,
            errors: false
        }
    },
    lintOnSave: false//关闭eslint检查
}