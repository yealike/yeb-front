<template>
  <div>
    <div class="permissTool">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>

      <el-input size="small" v-model="role.nameZh" placeholder="请输入角色中文名" @keydown.enter.native="doAddRole"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>

    </div>

    <div class="permissManaMain">

      <!--手风琴折叠面板-->
      <el-collapse v-model="activeName" accordion @change="change">

        <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button
                  style="float: right;color: red; padding: 3px 0"
                  type="text"
                  @click="doDeleteRole(r)"
                  icon="el-icon-delete"></el-button>
            </div>

            <div>
              <!--树形控件-->
              <el-tree
                  :data="allMenus"
                  ref="tree"
                  :key="index"
                  show-checkbox
                  node-key="id"
                  :default-checked-keys="selectMenus"
                  :props="defaultProps"></el-tree>

              <div style="display: flex;justify-content: flex-end">
                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                <el-button size="mini" type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
              </div>
            </div>

          </el-card>
        </el-collapse-item>

      </el-collapse>

    </div>
  </div>
</template>

<script>
export default {
  name: "PermissMana",
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      roles: [],
      allMenus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectMenus: [],
      activeName: -1
    }
  },
  mounted() {
    this.initRoles()
  },
  methods: {

    //删除角色
    doDeleteRole(role) {
      this.$confirm('删除该职位【' + role.nameZh + '】角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/permiss/role/' + role.id).then(resp => {
          if (resp) {
            this.initRoles()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    //添加角色
    doAddRole() {
      if (this.role.name && this.role.nameZh) {
        this.postRequest('/system/basic/permiss/role', this.role).then(resp => {
          if (resp) {
            this.initRoles()
            this.role.name = ''
            this.role.nameZh = ''
          }
        })
      } else {
        this.$message.error('所有字段不能为空！')
      }
    },

    cancelUpdate() {
      this.activeName = -1
    },

    doUpdate(rid, index) {
      let tree = this.$refs.tree[index];
      let selectedKeys = tree.getCheckedKeys(true);

      let url = '/system/basic/permiss/?rid=' + rid
      selectedKeys.forEach(key => {
        url += '&mids=' + key
      })
      this.putRequest(url).then(resp => {
        if (resp) {
          this.initRoles()
          //关闭折叠板
          this.activeName = -1
          this.initAllMenus()
        }
      })
    },

    change(rid) {
      if (rid) {
        this.initAllMenus()
        this.initSelectdMenus(rid)
      }

    },

    initSelectdMenus(rid) {
      this.getRequest('/system/basic/permiss/mid/' + rid).then(resp => {
        if (resp) {
          this.selectMenus = resp
        }
      })
    },

    initAllMenus() {
      this.getRequest('/system/basic/permiss/menus').then(resp => {
        this.allMenus = resp
      })
    },

    initRoles() {
      this.getRequest('/system/basic/permiss/').then(resp => {
        if (resp) {
          this.roles = resp
        }
      })
    }
  }
}
</script>

<style scoped>

.permissTool {
  display: flex;
  justify-content: flex-start;
}

.permissTool .el-input {
  width: 300px;
  margin-right: 6px;
}

.permissManaMain {
  margin-top: 20px;
  width: 700px;
}
</style>