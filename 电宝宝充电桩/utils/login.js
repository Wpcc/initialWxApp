export function login(fn, request) {
  wx.getSetting({ // 查看是否授权
    success(res) {
      if(res.authSetting['scope.userInfo']) {
        wx.getUserInfo({ // 获取用户信息
          success(res) {
            const userInfo = res.userInfo
            wx.login({ // 获取code的值
              success(res) {
                request('POST', '/api/login/login', {
                  data:{
                    nickname: userInfo.nickName, // 用户姓名
                    headimgurl: userInfo.avatarUrl, // 用户头像
                    sex: userInfo.gender, // 性别
                    code: res.code  // 后台服务器解析用的code
                  }
                })
                .then(res => {
                  wx.setStorageSync('session3rd', res.data.session3rd)
                  fn()
                })
              }
            })
          }
        })
      }
    }
  })
}