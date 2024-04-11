import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/Workplace'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  // console.log("路由代码从这里开始执行：")
  // console.log("看看to",to)
  // console.log("看看from",from)

  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  
  const token = storage.get(ACCESS_TOKEN)
  if (token) {
    // console.log("存在token", token)
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } 
    else {
      if (!store.getters.roles||store.getters.roles.length === 0) {
        store
        .dispatch('GetInfo')
        .then(res => {
          // generate dynamic router
          store.dispatch('GenerateRoutes', ).then(() => {
            // 动态添加可访问路由表
            store.getters.addRouters.forEach(r => {
              router.addRoute(r)
            })
            // 请求带有 redirect 重定向时，登录自动重定向到该地址
            const redirect = decodeURIComponent(from.query.redirect || to.path)
            if (to.path === redirect) {
              next({ ...to, replace: true })
            } 
            else {
              console.log("直接跳转到目标")
              // 跳转到目的路由
              next({ path: redirect })
            }
          })
        })
        .catch((err) => {
          console.log("你究竟getInfo报了什么错",err)
          notification.error({
            message: '错误',
            description: '请求用户信息失败，请重试'
          })
          // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
          store.dispatch('Logout').then(() => {next({ path: loginRoutePath })})
        })
      } 
      else {
        next()
      }
    }
  } 
  else {
    // console.log("不存在token")
    if (allowList.includes(to.name)) {
      // 页面在免登录名单，直接进入
      next()
    } 
    else {
      //不再免登录名单里,直接进入登录页，把你要进的页面给到redirect参数中
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // console.log("路由代码执行完毕")
  NProgress.done() // finish progress bar
})
