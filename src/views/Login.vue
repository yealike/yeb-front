<template>
  <div>
    <el-form :rules="rules"
             v-loading="loading"
             element-loading-text="正在登录"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             ref="loginForm"
             :model="loginForm"
             class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码"
                  style="width: 230px;margin-right: 5px"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha">


      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemeber">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>

    </el-form>
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      captchaUrl: '/captcha?time' + new Date(),//加上时间戳
      loginForm: {
        username: 'admin',
        password: '123',
        code: 123
      },
      loading: false,
      checked: true,
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    updateCaptcha() {
      this.captchaUrl = '/captcha?time=' + new Date()
    },
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.postRequest('/login', this.loginForm).then(response => {
            /**
             * 如果有返回对象进行路由跳转
             * 页面跳转中push和replace的区别
             * 使用push可以使用浏览器的回退功能回到上一页（登录页）而replace不能
             * 因为使用浏览器访问后续资源的时候不应该再继续进行登录验证
             * 所以需要处理token，将其放入请求头中
             */

            if (response) {
              this.loading = false
              //将token信息存入session中,存储用户token
              const tokenStr = response.obj.tokenHead + response.obj.token
              window.sessionStorage.setItem('tokenStr', tokenStr)

              //页面跳转
              let path = this.$route.query.redirect;
              this.$router.replace((path === '/' || path === undefined) ? '/home' : path)
            }
          })
        } else {
          this.$message.error('错了哦，请输入所有字段');
          return false
        }
      });
    }
  }
}
</script>

<style scoped>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #cac6c6;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0 auto 40px auto;
  text-align: center;
}

.loginRemeber {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>