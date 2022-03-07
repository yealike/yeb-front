<template>
  <!--操作员管理-->
  <div>
    <div style="display: flex;justify-content: center;margin-top: 10px">
      <el-input
          placeholder="通过用户名搜索用户"
          prefix-icon="el-icon-search"
          v-model="keywords"
          @keydown.enter.native="doSearch"
          style="width: 400px;margin-right: 10px"></el-input>
      <el-button
          type="primary"
          @click="doSearch"
          icon="el-icon-search">搜索
      </el-button>
    </div>
    <div class="admin-container">
      <el-card class=" admin-card" v-for="(admin,index) in admins" :key="index">
        <div slot="header" class="clearfix">
          <span>{{ admin.name }}</span>

          <el-button
              style="float: right; padding: 3px 0;color: red"
              type="text"
              @click="deleteAdmin(admin)"
              icon="el-icon-delete">删除
          </el-button>

        </div>
        <div>
          <!--用户头像相关操作-->
          <div class="img-container">
            <img
                :src="admin.userFace"
                :alt="admin.name"
                class="userFace-img"
                :title="admin.name">
          </div>
        </div>
        <!--用户信息相关操作-->
        <div class="userinfo-container">
          <div>用户名：{{ admin.name }}</div>
          <div>手机号码：{{ admin.phone }}</div>
          <div>电话号码：{{ admin.telephone }}</div>
          <div>地址：{{ admin.address }}</div>
          <div>
            用户状态：
            <el-switch
                v-model="admin.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                @change="enabledChange(admin)"
                inactive-text="禁用"
            ></el-switch>
          </div>

          <div>
            用户角色：
            <el-tag
                type="success"
                style="margin-right: 4px"
                v-for="(role,indexj) in admin.roles"
                :key="indexj">{{ role.nameZh }}
            </el-tag>

            <!--
                对话框
                show:对话框展开时触发的事件
                hide：对话框隐藏的时候触发的事件
            -->
            <el-popover
                placement="right"
                title="角色列表"
                width="200"
                @show="showPop(admin)"
                @hide="hidePop(admin)"
                trigger="click"
            >

              <!--选择下拉框-->
              <el-select v-model="selectedRoles" multiple placeholder="请选择">
                <el-option
                    v-for="(role,index) in allRoles"
                    :key="index"
                    :label="role.nameZh"
                    :value="role.id">
                </el-option>
              </el-select>

              <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
            </el-popover>

          </div>
          <!--用户备注-->
          <div>
            备注：{{ admin.remark }}
          </div>

        </div>

      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysAdmin",
  data() {
    return {
      admins: [],
      keywords: '',
      allRoles: [],
      selectedRoles: []
    }
  },
  mounted() {
    //使用生命周期钩子在页面渲染之前就展示所有数据
    this.initAdmins()
  },
  methods: {

    //对话框隐藏时触发的事件
    hidePop(admin) {

      let roles = []//roles中存放的是角色对象
      Object.assign(roles, admin.roles)
      let flag = false

      if (roles.length != this.selectedRoles.length) {
        flag = true
      } else {
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i]
          for (let j = 0; j < this.selectedRoles.length; j++) {
            let sr = this.selectedRoles[j]
            if (role.id === sr) {
              roles.splice(i, 1)
              i--
              break
            }
          }
        }
        if (roles.length != 0) {
          flag = true
        }
      }

      if (flag) {
        let url = '/system/admin/role?adminId=' + admin.id
        this.selectedRoles.forEach(sr => {
          url += '&rids=' + sr
        })
        this.putRequest(url).then(() => {
          this.initAdmins()
        })
      }
    },

    // 点击对话框的触发事件
    showPop(admin) {
      this.initAllRoles()
      let roles = admin.roles
      this.selectedRoles = []
      roles.forEach(role => {
        this.selectedRoles.push(role.id)
      })

    },
    //初始化用户角色列表
    initAllRoles() {
      this.getRequest('/system/admin/roles').then(resp => {
        if (resp) {
          this.allRoles = resp
        }
      })
    },

    //修改用户状态，绑定Switch事件
    enabledChange(admin) {
      this.putRequest('/system/admin/', admin).then(resp => {
        if (resp) {
          this.initAdmins()
        }
      })
    },

    //删除操作员
    deleteAdmin(admin) {
      this.$confirm('此操作将永久删除【' + admin.name + '】操作员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/admin/' + admin.id).then(resp => {
          if (resp) {
            this.initAdmins()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    //搜索操作员
    doSearch() {
      this.initAdmins()
    },

    //初始化操作员，获取所有操作员的数据
    initAdmins() {
      this.getRequest('/system/admin/?keywords=' + this.keywords).then(resp => {
        if (resp) {
          this.admins = resp
        }
      })
    }
  }
}
</script>

<style scoped>
.admin-container {
  display: flex;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: space-around;
}

.admin-card {
  width: 350px;
}

.userFace-img {
  width: 72px;
  height: 72px;
  border-radius: 72px;
}

.img-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.userinfo-container {
  font-size: 12px;
  color: #17cea2;
}
</style>