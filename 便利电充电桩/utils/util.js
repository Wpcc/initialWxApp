import {goIndex} from '../router/routes'
import {request} from '../api/request'

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

// 重新发起充电
export function recharge(num){
  request('POST','/api/Recharge/again',{
    header:{
      session3rd:wx.getStorageSync('session3rd')
    },
    data:{
      order_sn:num
    }
  })
  .then(res => {
    if(res.status === -1){
      return
    } else if(res.status === 1){
      if(res.data.charge_status === 1){
        return 
      }
      if(res.data.charge_status === 2){
        request('POST','/api/Recharge/again',{ // 再重新请求充电一次
          header:{
            session3rd:wx.getStorageSync('session3rd')
          },
          data:{
            order_sn:num
          }
        })
        .then(res => {
          if(res.status === -1){
            return
          } else if(res.status === 1){
            if(res.data.charge_status === 1){
              return 
            }
            if(res.data.charge_status === 2){
              return 
            }
          }
        })
      }
    }
  })
}