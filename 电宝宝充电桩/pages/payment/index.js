// pages/payment/index.js
import { request } from '../../api/request'
import { pay } from '../../utils/pay'
import {throttle} from '../../utils/throttle'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pileNum:[
      { id: 0, content: '0', background: '#ffffff', color: '#23C675', disable:false },
      { id: 1, content: '1', background: '#ffffff', color: '#23C675', disable:false },
      { id: 2, content: '2', background: '#ffffff', color: '#23C675', disable:false },
      { id: 3, content: '3', background: '#ffffff', color: '#23C675', disable:false },
      { id: 4, content: '4', background: '#ffffff', color: '#23C675', disable:false },
      { id: 5, content: '5', background: '#ffffff', color: '#23C675', disable:false },
      { id: 6, content: '6', background: '#ffffff', color: '#23C675', disable:false },
      { id: 7, content: '7', background: '#ffffff', color: '#23C675', disable:false },
      { id: 8, content: '8', background: '#ffffff', color: '#23C675', disable:false },
      { id: 9, content: '9', background: '#ffffff', color: '#23C675', disable:false }
    ],
    rechargePile:{
      id:'',
      port:''
    },
    start:0 // 节流时间变量
  },
  clickedPileNum: function (e) {
    const currentTarget = e.currentTarget 
    const num = currentTarget.dataset.num
    // 选中端口
    const port = parseInt(this.data.pileNum[num].content) + 1
    // 通过数据模拟循环设置数据
    for(let i=0; i<this.data.pileNum.length; i++){
      let obj = {}
      let background = 'pileNum[' + i + '].background'
      let color = 'pileNum[' + i + '].color'
      obj[background] = '#ffffff' 
      obj[color] = '#23C675'
      this.setData(obj)
    }
    let obj = {}
    let background = 'pileNum[' + num + ']background'
    let color = 'pileNum[' + num + '].color'
    obj[background] = '#23C675'
    obj[color] = '#ffffff'
    // 设置数据
    this.setData(obj)
    this.setData({
      'rechargePile.port': port.toString()
    })
  },
  // onLoad生命周期
  onLoad(option) {
    this.setData({
      'rechargePile.id': option.id.toString()
    })
    request('POST','/api/choiceport/index',{
    data:{
        id:option.id
      }
    })
    .then(res => {
      console.log(res.data)
      let obj = res.data
      let port = /^(port)/
      let i = 0
      for(var item in obj){
        if(port.test(item)){ //正则去除id
          //如果端口号为0，代表未占用。1则为占用
          // if(obj[item] === 0){
          //   let pilePort = {}
          //   let disable = 'pileNum[' + i + '].disable'
          // }
        i++       
        }
      }
    })
  },
  getUserInfo: function(e) {
    let that = this
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
        // 授权
          console.log('授权：' + wx.getStorageSync('userId'))
          // 由于code与用户信息是一起发送给后台，顾每次用户点击支付，都需要用code进行login
          wx.getUserInfo({
            success(res) {
              const userInfo = res.userInfo
              // 获取code的值
              throttle(() => { // 此处节流处理：减少用户点击支付按钮
                wx.login({
                  success(res) {
                    console.log('rechargePile: ' + JSON.stringify(that.data.rechargePile))
                    //将授权信息传递到后台
                    request('POST','/api/login/login',{
                      data:{
                        nickname: userInfo.nickName, // 用户姓名
                        headimgurl: userInfo.avatarUrl, // 用户头像
                        sex: userInfo.gender, //性别
                        code: res.code  //后台服务器解析用的code
                      }
                    })
                    .then(res => {
                      let userId = res.data.session3rd.toString()
                      // 下单
                      request('POST','/api/Build/buildOrder',{
                        header:{
                          'session3rd':userId
                        },
                        data:{
                          id: that.data.rechargePile.id,
                          port: that.data.rechargePile.port
                        }
                      })
                      .then(res => {
                        // 下单成功进行支付
                        pay(res.data)
                      })   
                    })
                  }
                })
              }, 5000, that)
            }
          })
        } else {
          // 未授权，提示用户授权
          wx.showToast({
            title: '请打开授权，否则无法支付',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  }
})