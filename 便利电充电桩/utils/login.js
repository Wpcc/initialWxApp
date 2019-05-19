import {request} from '../api/request'
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
          }
        })
      }
    })
    // wx.getSetting({ // 查看是否授权
    //   success(res) {
    //     if(res.authSetting['scope.userInfo']) {
    //       if(wx.getStorageSync('session3rd')) { // 用户注册
    //         resolve(1);
    //       }else {
    //         wx.login({
    //           success(res) {
    //             request('POST', '/api/Login1/getSessionKey', {
    //               data: {
    //                 code: res.code,
    //                 type: 1
    //               }
    //             })
    //             .then(res => {
    //               let key = res.data.key
    //               console.log(key)
    //               if (res.status === 1) {
    //                 wx.getUserInfo({
    //                   success(res) {
    //                     let encryptedData = res.encryptedData
    //                     let iv = res.iv
    //                     request('POST', '/api/Login1/login', {
    //                       data: {
    //                         encryptedData: encryptedData,
    //                         iv: iv,
    //                         type: 1,
    //                         key: key
    //                       }
    //                     })
    //                     .then(res => {
    //                       wx.setStorageSync('session3rd',res.data.session3rd); // 保存用户登录凭证
    //                       wx.setStorageSync('openid', res.data.openid);
    //                       resolve(1);
    //                     })
    //                   }
    //                 })
    //               }
    //             })
    //           }
    //         })
    //       }
    //     } else {
    //       resolve(0);
    //     }
    //   }
    // })
  })
}