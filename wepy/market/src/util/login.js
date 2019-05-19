import {request} from './request'
export const login = (data) => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        request('POST', '/api/Login1/getSessionKey', {
          data: {
            code: res.code,
            type: 2,
            session3rd: '775d5756791c64bf11e709dfe2250716' || ''
          }
        })
        .then(res => {
          if (wx.getStorageSync('session3rd')) {
            resolve(1)
            return
          }
          let key = res.data.key
          if (res.status === 1) {
            wx.getUserInfo({
              success(res) {
                let encryptedData = res.encryptedData
                let iv = res.iv
                request('POST', '/api/Login1/login', {
                  data: {
                    encryptedData: encryptedData,
                    iv: iv,
                    type: 2,
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
          }
        })
      }
    })
  })
}
