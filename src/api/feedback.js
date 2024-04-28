import request from '@/utils/request'

const feedbackApi = {
  newFeedback: "/feedback/new",
  replyFeedback: "/feedback/reply",
  getMyFeedback:"/feedback/my",
  getAllFeedback:"/feedback/all"
}

/**
 * 用户新增反馈信息
 */
export function newFeedback(parameter) {
  return request({
    url: feedbackApi.newFeedback,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'application/json' },
  })
}


/**
 * 用户获得自己的历史反馈记录
 */
export function getMyFeedback() {
  return request({
    url: feedbackApi.getMyFeedback,
    method: 'get',
  })
}


/**
 * 管理员回复用户反馈
 */
export function replyFeedback(parameter) {
  return request({
    url: feedbackApi.replyFeedback,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'application/json' },
  })
}


/**
 * 管理员获得所有用户反馈
 */
export function getAllFeedback() {
  return request({
    url: feedbackApi.getAllFeedback,
    method: 'get',
  })
}
