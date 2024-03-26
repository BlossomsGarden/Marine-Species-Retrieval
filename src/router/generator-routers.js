// eslint-disable-next-line
import * as loginService from '@/api/login'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'
import dashboard from '@/locales/lang/en-US/dashboard'

// 页面路径引入
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // Workplace: (resolve) => require([`@/views/dashboard/Workplace.vue`] ,resolve),
  // Analysis: (resolve) => require([`@/views/dashboard/Analysis.vue`] ,resolve)

  // 你需要动态引入的页面组件
  Workplace: () => import('@/views/dashboard/Workplace'),
  Analysis: () => import('@/views/dashboard/Analysis'),

  // form
  BasicForm: () => import('@/views/form/basicForm'),
  StepForm: () => import('@/views/form/stepForm/StepForm'),
  AdvanceForm: () => import('@/views/form/advancedForm/AdvancedForm'),

  // // list
  // TableList: () => import('@/views/list/TableList'),
  // StandardList: () => import('@/views/list/BasicList'),
  // CardList: () => import('@/views/list/CardList'),
  // SearchLayout: () => import('@/views/list/search/SearchLayout'),
  // SearchArticles: () => import('@/views/list/search/Article'),
  // SearchProjects: () => import('@/views/list/search/Projects'),
  // SearchApplications: () => import('@/views/list/search/Applications'),
  // ProfileBasic: () => import('@/views/profile/basic'),
  // ProfileAdvanced: () => import('@/views/profile/advanced/Advanced'),

  // // result
  // ResultSuccess: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
  // ResultFail: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),

  // // exception
  // Exception403: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  // Exception404: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  // Exception500: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),

  // // account
  // AccountCenter: () => import('@/views/account/center'),
  // AccountSettings: () => import('@/views/account/settings/Index'),
  // BasicSetting: () => import('@/views/account/settings/BasicSetting'),
  // SecuritySettings: () => import('@/views/account/settings/Security'),
  // CustomSettings: () => import('@/views/account/settings/Custom'),
  // BindingSettings: () => import('@/views/account/settings/Binding'),
  // NotificationSettings: () => import('@/views/account/settings/Notification')

  // 'TestWork': () => import(/* webpackChunkName: "TestWork" */ '@/views/dashboard/TestWork')
}

// 总目录记录
const wholeMenuInfo=[
  // 第一个一级目录DashBoard
  {
    'name': 'dashBoard',
    'parentId': 0,
    'id': 1,
    'meta': { 'title': 'Dashboard', 'icon': dashboard,'hideChildren': false },
    'component': 'RouteView',
    'redirect': '/dashboard/Workplace'
  },
  // DashBoard包括2个子目录：Analysis + Workplace
  {
    name: 'Analysis',
    parentId: 1,
    id: 11,
    meta: { title: 'Analysis', show:true },
    component:'Analysis'
  },{
    name: 'Workplace',
    parentId: 1,
    id: 12,
    meta: { title: 'Workplace', show:true },
    component:'Workplace'
  },

  //第二个一级目录form
  {
    'name': 'form',
    'parentId': 0,
    'id': 2,
    'meta': { 'title': 'Form', 'icon': 'form','hideChildren': false },
    'component': 'RouteView',
    'redirect': '/form/basicForm'
  },
  // DashBoard包括2个子目录：Analysis + Workplace
  {
    name: 'BasicForm',
    parentId: 2,
    id: 21,
    meta: { title: 'BasicForm', show:true },
    component:'BasicForm'
  },{
    name: 'StepForm',
    parentId: 2,
    id: 22,
    meta: { title: 'StepForm', show:true },
    component:'StepForm'
  },{
    name: 'AdvancedForm',
    parentId: 2,
    id: 23,
    meta: { title: 'AdvancedForm', show:true },
    component:'AdvancedForm'
  },
]



// 前端未找到页面路由
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}


// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  path: '',
  component: 'BasicLayout',
  redirect: '/dashboard',
  meta: {
    title: '首页'
  },
  children: []
}



/**
 * 动态生成其他菜单
 * 
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    
    // 首先将wholeMenuInfo转为vue能读懂的树结构
    const wholeMenuTree=[]
    // 获得总的目录树
    listToTree(wholeMenuInfo, wholeMenuTree, 0)
    console.log("看看你的总的目录树是什么wholeMenuTree", wholeMenuTree)

    loginService
      .getCurrentUserMenuPermission()
      .then(res => {
        console.log('看看你的目录权限返回值res', res)

        
        const menuHasPermission = wholeMenuTree.filter(item1 =>
          res.data.some(item2 => item2.routeId === item1.id)
        );
        console.log('看看你有权限访问的目录都是什么menuHasPermission', menuHasPermission)
        rootRouter.children = menuHasPermission

        const menuNav = []
        menuNav.push(rootRouter)
        console.log("看看menuNav",menuNav)
        
        const routers = generator(menuNav)
        routers.push(notFoundRouter)

        console.log('routers', routers)
        
        resolve(routers)
      })
      .catch(err => {
        console.log("不知道你报了什么错",err)
        reject(err)
      })
  })
}


/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: constantRouterComponents[item.component || item.key] || (() => import(`@/views/${item.component}`)),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name
      }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
