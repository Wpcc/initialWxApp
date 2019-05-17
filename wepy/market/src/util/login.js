import {request} from './request'
export const login = (data) => {
  return new Promise((resolve, reject) => {
    wx.getSetting({ // 查看是否授权
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          if (wx.getStorageSync('session3rd')) { // 用户注册
            resolve(1)
          } else {
            // wx.login({
            //   success(res) {
            //     console.log('123')
            //     console.log(res.code)
            //   }
            // })
            wx.getUserInfo({
              success(res) {
                console.log(res.encryptedData + ':', res.iv)
              }
            })
            // wx.getUserInfo({
            //   success(res) {
            //     console.log(res)
            //     let encryptedData = res.encryptedData
            //     let iv = res.iv
            //     wx.login({ // 获取code的值
            //       success(res) {
            //         console.log(encryptedData + ':', res.code + ':', iv)
            //         request('POST', '/api/Login1/login', {
            //           data: {
            //             encryptedData: encryptedData,
            //             iv: iv,
            //             type: 2,
            //             code: res.code  // 后台服务器解析用的code
            //           }
            //         })
            //         .then(res => {
            //           wx.setStorageSync('session3rd', res.data.session3rd) // 保存用户登录凭证
            //           wx.setStorageSync('openid', res.data.openid)
            //           if (wx.getStorageSync('key')) { // 分享接口
            //             request('POST', '/api/Share/index', {
            //               header: {
            //                 session3rd: wx.getStorageSync('session3rd')
            //               },
            //               data: {
            //                 openid: wx.getStorageSync('openid'),
            //                 key: wx.getStorageSync('key')
            //               }
            //             })
            //           }
            //           resolve(1)
            //         })
            //       }
            //     })
            //   }
            // })
          }
        } else {
          resolve(0)
        }
      }
    })
  })
}
