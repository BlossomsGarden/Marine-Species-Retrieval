<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" :tab="$t('user.login.tab-login-credentials')">
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="$t('user.login.message-invalid-credentials')" />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.login.username.placeholder')"
              v-decorator="[
                'username_user',
                {rules: [{ required: true, message: $t('user.userName.required') }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              :placeholder="$t('user.login.password.placeholder')"
              v-decorator="[
                'password_user',
                {rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
        </a-tab-pane>

        <a-tab-pane key="tab2" :tab="$t('user.login.tab-login-mobile')">
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="$t('user.login.message-invalid-credentials')" />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.login.acc.placeholder.admin')"
              v-decorator="[
                'username_admin',
                {rules: [{ required: true, message: $t('user.admin.userName.required') }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              :placeholder="$t('user.login.psw.placeholder.admin')"
              v-decorator="[
                'password_admin',
                {rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
        </a-tab-pane>

      </a-tabs>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">{{ $t('user.login.remember-me') }}</a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >{{ $t('user.login.forgot-password') }}</router-link>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >{{ $t('user.login.login') }}</a-button>
      </a-form-item>

      <div class="user-login-other">
        <router-link class="register" :to="{ name: 'register' }">{{ $t('user.login.signup') }}</router-link>
      </div>
    </a-form>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </div>
</template>

<script>
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { userLogin, adminLogin } from '@/api/login'
import storage from 'store'
import store from '@/store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import router from '@/router'

export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
      } = this

      state.loginBtn = true

      validateFields({ force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          
          if (customActiveKey === 'tab1'){
            loginParams.name = values.username_user
            loginParams.password = values.password_user
            // console.log("你是用户登录",loginParams)

            userLogin(loginParams)
            .then((res) => {
              if(res.success){
                // console.log("登录成功了",res.data.token)

                storage.set(ACCESS_TOKEN, res.data.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                storage.set('name', res.data.name),
                storage.set('avatarUrl',res.data.avatarUrl)


                store.dispatch('GenerateRoutes').then(() => {
                  // 根据roles权限生成可访问的路由表
                  // 动态添加可访问路由表
                  // VueRouter@3.5.0+ New API
                  store.getters.addRouters.forEach(r => {
                    router.addRoute(r)
                  })
                
                
                  this.$router.push({ path: this.$route.query.redirect ? this.$route.query.redirect : '/' })


                  // 延迟 1 秒显示欢迎信息
                  setTimeout(() => {
                    this.$notification.success({
                      message: '欢迎',
                      description: `${timeFix()}，赶紧给👴干活！`
                    })
                  }, 1000)
                  this.isLoginError = false
                })
              }
              else{
                this.$notification.error({
                  message: '出错了',
                  description: res.msg,
                  duration: 4
                })
              }
            })
            .catch((err) => {
              this.isLoginError = true
              this.$notification.error({
                message: '错误',
                description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
                duration: 4
              })
            })
            .finally(() => {
              state.loginBtn = false
            })
          }
          else if(customActiveKey === 'tab2'){
            loginParams.name = values.username_admin
            loginParams.password = values.password_admin
            // console.log("你是管理员登录",loginParams)
            adminLogin(loginParams)
            .then((res) => {
              if(res.success){
                // console.log("登录成功了",res.data.token)

                storage.set(ACCESS_TOKEN, res.data.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                storage.set('name', res.data.name),
                storage.set('avatarUrl',res.data.avatarUrl)


                store.dispatch('GenerateRoutes').then(() => {
                  // 根据roles权限生成可访问的路由表
                  // 动态添加可访问路由表
                  // VueRouter@3.5.0+ New API
                  store.getters.addRouters.forEach(r => {
                    router.addRoute(r)
                  })
                  
                  this.$router.push({ path: this.$route.query.redirect ? this.$route.query.redirect : '/' })

                  // 延迟 1 秒显示欢迎信息
                  setTimeout(() => {
                    this.$notification.success({
                      message: '欢迎',
                      description: `${timeFix()}，赶紧给👴干活！`
                    })
                  }, 1000)
                  this.isLoginError = false
                })
              }
              else{
                this.$notification.error({
                  message: '出错了',
                  description: res.msg,
                  duration: 4
                })
              }
            })
            .catch((err) => {
              this.isLoginError = true
              this.$notification.error({
                message: '错误',
                description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
                duration: 4
              })
            })
            .finally(() => {
              state.loginBtn = false
            })
          }
        } 
        else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
