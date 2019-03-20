// pages/payment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pileNum:[
      { id: 0, content: '0', background: '#ffffff', color: '#23C675' },
      { id: 1, content: '1', background: '#ffffff', color: '#23C675' },
      { id: 2, content: '2', background: '#ffffff', color: '#23C675' },
      { id: 3, content: '3', background: '#ffffff', color: '#23C675' },
      { id: 4, content: '4', background: '#ffffff', color: '#23C675' },
      { id: 5, content: '5', background: '#ffffff', color: '#23C675' },
      { id: 6, content: '6', background: '#ffffff', color: '#23C675' },
      { id: 7, content: '7', background: '#ffffff', color: '#23C675' },
      { id: 8, content: '8', background: '#ffffff', color: '#23C675' },
      { id: 9, content: '9', background: '#ffffff', color: '#23C675' }
    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 获取用户信息兼容：这里没使用
    userId: wx.getStorageSync('userId')
  },
  clickedPileNum: function (e) {
    const currentTarget = e.currentTarget 
    // 通过数据模拟循环设置数据
    for(let i=0; i<this.data.pileNum.length; i++){
      var obj = {}
      var background = 'pileNum[' + i + '].background'
      var color = 'pileNum[' + i + '].color'
      obj[background] = '#ffffff' 
      obj[color] = '#23C675'
      this.setData(obj)
    }
    var obj = {}
    var background = 'pileNum[' + currentTarget.dataset.num + ']background'
    var color = 'pileNum[' + currentTarget.dataset.num + '].color'
    obj[background] = '#23C675'
    obj[color] = '#ffffff'
    this.setData(obj)
  },
  // onLoad生命周期
  onLoad() {
    if(this.data.userId) {
      //直接支付
      console.log('this.data.userId:' + this.data.userId)
    }else{
      // 查看是否授权
      wx.getSetting({
        success (res) {
          if(res.authSetting['scope.userInfo']){
            //已经授权，调用getUserInfo 获取头像昵称
            console.log('authSetting')
            wx.getUserInfo({
              success(res){
                const userInfo = res.userInfo
                wx.login({
                  success(res){
                    //将授权信息传递到后台
                    wx.request({
                      url:'https://backend.quanjieshop.com/api/login/login',
                      method:'post',
                      data:{
                        nickname: userInfo.nickName,
                        headimgurl: userInfo.avatarUrl,
                        sex: userInfo.gender,
                        code: res.code
                      },
                      success(res) {
                        // 调取本地缓存
                        console.log(res.data.data.session3rd)
                        const userId = res.data.data.session3rd.toString()
                        console.log(userId)
                        wx.setStorage({
                          key:'userId',
                          data:userId
                        })
                      }
                    })
                  }
                }) 
              }
            })
          }
        }
      })
    }
  }
})