import user from '@/locales/lang/en-US/user'
import request from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',

  EditInfo:'/userManage/editInfo',
  deleteUser:'/userManage/delete',
  getAllUser:'/userManage/allUser',
  blockUser:'/userManage/block',
  newUser:'/userManage/new',
  getAllOrg:'/userManage/allOrganization'
}

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}
export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}
export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}
export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}
export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}
// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}




/**
 * 修改使用者信息
 */
export function editInfo (param) {
  return request({
    url: api.EditInfo,
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}


/**
 * 查找用户
 */
export function getAllUser (orgId, keyword) {
  return request({
    url: api.getAllUser+
    "?orgId="+orgId+
    "&keyword="+keyword,
    method: 'get',
  })
}


/**
 * 封禁用户
 */
export function blockUser (userId) {
  return request({
    url: api.blockUser+"?userId="+userId,
    method: 'post',
  })
}

/**
 * 软删除用户
 */
export function deleteUser (userId) {
  return request({
    url: api.deleteUser+"?userId="+userId,
    method: 'post',
  })
}

/**
 * 新增用户
 */
export function newUser (param) {
  return request({
    url: api.newUser,
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/**
 * 获得所有组织
 */
export function getAllOrg () {
  return request({
    url: api.getAllOrg,
    method: 'get',
  })
}
