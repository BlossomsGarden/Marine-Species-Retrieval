import request from '@/utils/request'

const feedbackApi = {
    newFeedback:"/feedback/new",
    replyFeedback:"/feedback/reply"
}

/**
 * 用户新增反馈信息
 */
export function newFeedback (parameter) {
  return request({
    url: feedbackApi.newFeedback,
    method: 'post',
    data: parameter,
    headers: {'Content-Type': 'application/json'},
  })
}

/**
 * 管理员回复用户反馈
 */
export function replyFeedback (parameter) {
    return request({
      url: feedbackApi.replyFeedback,
      method: 'post',
      data: parameter,
      headers: {'Content-Type': 'application/json'},
    })
  }

