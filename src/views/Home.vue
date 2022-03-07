<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">云E办</div>

        <div>
          <el-button type="text" icon="el-icon-bell" size="normal"
                     style="margin-right: 8px;color: black;" @click="goChat"></el-button>
          <!--首行工具条-->
          <el-dropdown class="userInfo" @command="commandHandler">
          <span class="el-dropdown-link">
            {{ user.name }}<i><img :src="user.userFace"></i>
         </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="userSetting">设置</el-dropdown-item>
              <el-dropdown-item command="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </el-header>
      <el-container>
        <el-aside width="200px">

          <el-menu router unique-opened>
            <template v-for="(item,index) in routes">

              <el-submenu :index="index+''" v-if="!item.hidden" :key="index">

                <template slot="title">
                  <!--图标-->
                  <i :class="item.iconCls" style="color: #2d564c;margin-right: 5px"></i>
                  <span>{{ item.name }}</span>
                </template>

                <el-menu-item :index="children.path" v-for="(children,indexj) in item.children" :key="indexj">
                  {{ children.name }}
                </el-menu-item>

              </el-submenu>
            </template>
          </el-menu>

        </el-aside>
        <el-main>
          <!--首页不需要面包屑效果-->
          <el-breadcrumb separator-class="el-icon-arrow-right"
                         v-if="this.$router.currentRoute.path!=='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path==='/home'">
            欢迎来到云E办系统
          </div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes
    }
  },
  methods: {
    //去聊天
    goChat(){
      this.$router.push('/chat')
    },
    commandHandler(command) {
      if (command === 'logout') {

        this.$confirm('退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //注销登录，要清除sessionStorage中的令牌信息，并且跳转到登录页面
          this.postRequest('/logout')
          window.sessionStorage.removeItem('tokenStr')
          window.sessionStorage.removeItem('user')
          //清除vuex菜单数据
          this.$store.commit('initRoutes', [])
          this.$router.replace('/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });


      }
    }
  }
}
</script>

<style scoped>
.homeHeader {
  background-color: rgba(156, 229, 153, 0.85);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  font-family: "Arial Black";
  color: white;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}
.homeWelcome{
  text-align: center;
  font-size: 30px;
  font-family: 华文行楷;
  color: skyblue;
  padding-top: 50px;
}
.homeRouterView{
  margin-top: 10px;
}
</style>