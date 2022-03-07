import {getRequest} from "@/utils/api";

/**
 * 菜单请求封装工具
 * @param router
 * @param store
 */
export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return
    }

    getRequest('/system/cfg/menu').then(data => {
        if (data) {
            //格式化返回数据,并将其添加到路由
            let fmtRoutes = formatRoutes(data)
            router.addRoutes(fmtRoutes)

            //数据存到vuex里面
            store.commit('initRoutes', fmtRoutes)
        }
    })
}

export const formatRoutes = (routes) => {
    let fmtRoutes = []
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            iconCls,
            children
        } = router

        if (children && children instanceof Array) {
            //递归
            children = formatRoutes(children)
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            component(resolve) {
                if (component.startsWith('Home')) {
                    require(['@/views/' + component + '.vue'], resolve)
                } else if (component.startsWith('Emp')) {
                    //获取菜单对象
                    require(['@/views/emp/' + component + '.vue'], resolve)
                } else if (component.startsWith('Per')) {
                    require(['@/views/per/' + component + '.vue'], resolve)
                } else if (component.startsWith('Sal')) {
                    require(['@/views/sal/' + component + '.vue'], resolve)
                } else if (component.startsWith('Sta')) {
                    require(['@/views/sta/' + component + '.vue'], resolve)
                } else if (component.startsWith('Sys')) {
                    require(['@/views/sys/' + component + '.vue'], resolve)
                }

            }
        }
        fmtRoutes.push(fmRouter)
    })
    return fmtRoutes
}