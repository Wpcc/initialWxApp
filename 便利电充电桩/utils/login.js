import {request} from '../api/request'
import {tip} from './tip'
export const login = (data) => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        request('POST', '/api/Login1/getSessionKey', {
          data: {
            code: res.code,
            type: 1,
            session3rd: wx.getStorageSync('session3rd') || ''
          }
        })
        .then(res => {
          tip.loaded()
          if (wx.getStorageSync('session3rd')) {
            if (res.status === 0) {
              wx.removeStorageSync('session3rd')
            } else if (res.status === 1) {
              resolve(1)
              return
            }
          }
          let key = res.data.key
          wx.getUserInfo({
            success(res) {
              let encryptedData = res.encryptedData
              let iv = res.iv
              request('POST', '/api/Login1/login', {
                data: {
                  encryptedData: encryptedData,
                  iv: iv,
                  type: 1,
                  key: key
                }
              })
              .then(res => {
                wx.setStorageSync('session3rd', res.data.session3rd) // 保存用户登录凭证
                wx.setStorageSync('openid', res.data.openid)
                resolve(1)
              })
            }
          })
        })
      }
    })
  })
}