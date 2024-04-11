import request from '@/utils/request'

const userApi = {
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  SendSms: '/account/sms',


  GetInfo: '/getInfo',
  EditInfo:'/editInfo',
  UserMenuPermission: '/menu_permission',
  Logout: '/logout',

  GetAdminInfo: '/admin/getInfo',
  AdminLogin: '/admin/login',
  GetUserInfo: '/user/getInfo',
  UserLogin: '/user/login',
}




export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取使用者信息
 */
export function getInfo () {
  return request({
    url: userApi.GetInfo,
    method: 'get',
  })
}

/**
 * 修改使用者信息
 */
export function editInfo (param) {
  return request({
    url: userApi.EditInfo,
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}


/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}




/**
 * @returns 当前登录用户的目录可查看目录权限
 */
export function getCurrentUserMenuPermission () {
  return request({
    url: userApi.UserMenuPermission,
    method: 'get'
  })
}

/**
 * 当前使用者登出
 */
export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
  })
}


/**
 * 管理员登录
 */
export function adminLogin (param) {
  console.log("正在登录")
  return request({
    url: userApi.AdminLogin,
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/**
 * 管理员获取信息
 */
export function getAdminInfo () {
  return request({
    url: userApi.GetAdminInfo,
    method: 'get'
  })
}




/**
 * 用户登录
 */
export function userLogin (param) {
  return request({
    url: userApi.UserLogin,
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}


/**
 * 用户获取信息
 */
export function getUserInfo () {
  return request({
    url: userApi.GetUserInfo,
    method: 'get'
  })
}

