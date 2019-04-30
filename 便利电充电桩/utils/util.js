import {goIndex} from '../router/routes'
// 日期格式化
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 登录注册
export function checkAuthAndLogin(){
  wx.getSetting({
    success(res) {
      if(!res.authSetting['scope.userInfo'] || !wx.getStorageSync('session3rd') ) { // 如果用户授权
        goIndex()
      }
    }
  })
}