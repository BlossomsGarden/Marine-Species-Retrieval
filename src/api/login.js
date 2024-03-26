import request from '@/utils/request'

const userApi = {
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  UserInfo: '/user/info',


  AdminLogin: '/admin/login',
  UserMenuPermission: '/admin/menu_permission'
}




export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
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

