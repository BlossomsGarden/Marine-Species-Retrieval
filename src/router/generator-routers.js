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

  // dashBoard
  Workplace: () => import('@/views/dashboard/Workplace'),
  Analysis: () => import('@/views/dashboard/Analysis'),

  // PlatformManagement
  AccountManagement:()=>import('@/views/PlatformManagement/AccountManagement'),
  ContentManagement:()=>import('@/views/PlatformManagement/ContentManagement'),

  // UserActivity
  ErrorReport:()=>import("@/views/UserActivity/ErrorReport"),
  Feedback:()=>import("@/views/UserActivity/Feedback"),
  NewSpeciesRequest:()=>import("@/views/UserActivity/NewSpeciesRequest"),

  //Encyclopedia
  BioDB:()=>import("@/views/Encyclopedia/BioDB"),
  AttributeQuery:()=>import("@/views/Encyclopedia/AttributeQuery"),

  //AddSpecies
  AddSpecies:()=>import("@/views/AddSpecies/AddSpecies"),

  //PostFeedback
  PostFeedback:()=>import("@/views/PostFeedback/PostFeedback"),

  // form
  BasicForm: () => import('@/views/form/basicForm'),
  StepForm: () => import('@/views/form/stepForm/StepForm'),
  AdvanceForm: () => import('@/views/form/advancedForm/AdvancedForm'),

  // list
  TableList: () => import('@/views/list/TableList'),
  BasicList: () => import('@/views/list/BasicList'),
  CardList: () => import('@/views/list/CardList'),
  SearchLayout: () => import('@/views/list/search/SearchLayout'),
  SearchArticles: () => import('@/views/list/search/Article'),
  SearchProjects: () => import('@/views/list/search/Projects'),
  SearchApplications: () => import('@/views/list/search/Applications'),


  // profile
  ProfileBasic: () => import('@/views/profile/basic'),
  ProfileAdvanced: () => import('@/views/profile/advanced/Advanced'),


  // result
  ResultSuccess: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
  ResultFail: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),


  // exception
  Exception403: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  Exception404: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  Exception500: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),


  // account
  AccountCenter: () => import('@/views/account/center'),
  BasicSetting: () => import('@/views/account/settings/BasicSetting'),

  // 'TestWork': () => import(/* webpackChunkName: "TestWork" */ '@/views/dashboard/TestWork')
}


// 总目录记录
const wholeMenuInfo=[
  // 第一个一级目录DashBoard
  {
    'name': 'dashBoard',
    'parentId': 0,
    'id': 1,
    'meta': { 'title': 'Dashboard', 'icon': 'dashboard','hideChildren': false },
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
    name: 'AdvanceForm',
    parentId: 2,
    id: 23,
    meta: { title: 'AdvanceForm', show:true },
    component:'AdvanceForm'
  },
  


  //第三个一级目录list
  {
    name: 'list',
    'parentId': 0,
    'id': 3,
    component: 'RouteView',
    redirect: '/list/table-list',
    meta: { title: 'menu.list', icon: 'table', 'hideChildren': false },
  },
  // list包括4个子目录：SearchTable + BasicList + CardList + SearchList
  {
    name: 'TableList',
    'parentId': 3,
    'id': 31,
    component: 'TableList',
    meta: { title: 'menu.list.table-list'}
  },
  {
    name: 'BasicList',
    'parentId': 3,
    'id': 32,
    component: 'BasicList',
    meta: { title: 'menu.list.basic-list' }
  },
  {
    name: 'CardList',
    'parentId': 3,
    'id': 33,
    component: 'CardList',
    meta: { title: 'menu.list.card-list'}
  },
  {
    name: 'SearchLayout',
    'parentId': 3,
    'id': 34,
    component:'SearchLayout',
    redirect: '/list/search/article',
    meta: { title: 'menu.list.search-list'},
  },
  // SearchList还包括3个页内子目录
  {
    'parentId': 34,
    'id': 341,
    path: '/list/search/article',
    name: 'SearchArticles',
    component: 'SearchArticles',
    meta: { title: 'menu.list.search-list.articles' }
  },
  {
    'parentId': 34,
    'id': 342,
    path: '/list/search/project',
    name: 'SearchProjects',
    component: 'SearchProjects',
    meta: { title: 'menu.list.search-list.projects' }
  },
  {
    'parentId': 34,
    'id': 343,
    path: '/list/search/application',
    name: 'SearchApplications',
    component: 'SearchApplications',
    meta: { title: 'menu.list.search-list.applications' }
  },
  


  //第四个一级目录profile
  {
    name: 'profile',
    'parentId': 0,
    'id': 4,
    component: 'RouteView',
    meta: { title: 'menu.profile', icon: 'profile'},
    redirect: '/profile/ProfileBasic',
  },
  // profile包括2个子目录：ProfileBasic + ProfileAdvanced
  {
    name: 'ProfileBasic',
    'parentId': 4,
    'id': 41,
    component: 'ProfileBasic',
    meta: { title: 'menu.profile.basic'}
  },
  {
    name: 'ProfileAdvanced',
    'parentId': 4,
    'id': 42,
    component: 'ProfileAdvanced',
    meta: { title: 'menu.profile.advanced'}
  },



  // 第五个一级目录result
  {
    name: 'result',
    'parentId': 0,
    'id': 5,
    component: 'RouteView',
    redirect: '/result/ResultSuccess',
    meta: { title: 'menu.result', icon: 'check-circle-o'}
  },
  // result包括2个子目录：ResultSuccess + ResultFail
  {
    name: 'ResultSuccess',
    'parentId': 5,
    'id': 51,
    component: 'ResultSuccess',
    meta: { title: 'menu.result.success', hiddenHeaderContent: true }
  },
  {
    name: 'ResultFail',
    'parentId': 5,
    'id': 52,
    component:'ResultFail',
    meta: { title: 'menu.result.fail', hiddenHeaderContent: true }
  },



  //第六个一级目录account
  {
    'name': 'account',
    'parentId': 0,
    'id': 6,
    'meta': { title: 'Account', icon: 'user','hideChildren': false },
    'component': 'RouteView',
    'redirect': '/account/AccountCenter',
  },
  // account包括2个子目录：AccountCenter + BasicSetting
  {
    name: 'AccountCenter',
    parentId: 6,
    id: 61,
    meta: { title: 'menu.account.center', show:true},
    component: 'AccountCenter',
  },
  {
    name: 'BasicSetting',
    parentId: 6,
    id: 62,
    meta: { title: 'BasicSetting', show:true},
    component: 'BasicSetting',
  },



  //第七个一级目录PlatformManagement
  {
    'name': 'PlatformManagement',
    'parentId': 0,
    'id': 7,
    'meta': { title: '平台管理', icon: 'form','hideChildren': false },
    'component': 'RouteView',
    'redirect': '/PlatformManagement/AccountManagement',
  },
  // PlatformManagement包括2个子目录：AccountManagement + ContentManagement
  {
    name: 'AccountManagement',
    parentId: 7,
    id: 71,
    meta: { title: '账号管理', show:true},
    component: 'AccountManagement',
  }, 
  {
    name: 'ContentManagement',
    parentId: 7,
    id: 72,
    meta: { title: '内容管理', show:true},
    component: 'ContentManagement',
  },


  //第八个一级目录UserActivity
  {
    'name': 'UserActivity',
    'parentId': 0,
    'id': 8,
    'meta': { title: '动态管理', icon: 'profile','hideChildren': false },
    'component': 'RouteView',
    'redirect': '/UserActivity/NewSpeciesRequest',
  },
  // UserActivity包括3个子目录：NewSpeciesRequest + Feedback + ErrorReport
  {
    name: 'NewSpeciesRequest',
    parentId: 8,
    id: 81,
    meta: { title: '新增请求', show:true},
    component: 'NewSpeciesRequest',
  }, 
  {
    name: 'Feedback',
    parentId: 8,
    id: 82,
    meta: { title: '用户反馈', show:true},
    component: 'Feedback',
  }, 
  {
    name: 'ErrorReport',
    parentId: 8,
    id: 83,
    meta: { title: '用户报错', show:true},
    component: 'ErrorReport',
  }, 


  //第九个一级目录Encyclopedia
  {
    'name': 'Encyclopedia',
    'parentId': 0,
    'id': 9,
    'meta': { title: '生物百科', icon: 'table','hideChildren': false },
    'component': 'RouteView',
    'redirect': '/Encyclopedia/BioDB',
  },
  // Encyclopedia包括2个子目录：BioDB + AttributeQuery
  {
    name: 'BioDB',
    parentId: 9,
    id: 91,
    meta: { title: '生物志库', show:true},
    component: 'BioDB',
  }, 
  {
    name: 'AttributeQuery',
    parentId: 9,
    id: 92,
    meta: { title: '归属查询', show:true},
    component: 'AttributeQuery',
  },


  //第十个一级目录AddSpecies，不设置子目录
  {
    'name': 'AddSpecies',
    'parentId': 0,
    'id': 10,
    'meta': { title: '新增物种', icon: 'form'},
    'component': 'AddSpecies'
  },
  

  //第十一个一级目录PostFeedback，不设置子目录
  {
    'name': 'PostFeedback',
    'parentId': 0,
    'id': 11,
    'meta': { title: '上传反馈', icon: 'check-circle-o'},
    'component': 'PostFeedback'
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
    console.log("总的目录树wholeMenuTree:", wholeMenuTree)

    loginService
      .getCurrentUserMenuPermission()
      .then(res => {
        console.log('目录权限返回值:', res.data)

        const menuHasPermission = wholeMenuTree.filter(item1 =>
          res.data.some(item2 => item2.routeId === item1.id)
        );
        rootRouter.children = menuHasPermission

        const menuNav = []
        menuNav.push(rootRouter)
        const routers = generator(menuNav)
        routers.push(notFoundRouter)
        
        resolve(routers)
      })
      .catch(err => {
        console.log("不知道动态生成路由时报了什么错",err)
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
