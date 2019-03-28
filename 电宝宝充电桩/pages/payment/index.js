// pages/payment/index.js
import { request } from '../../api/request'
import { pay } from '../../utils/pay'
import { throttle } from '../../utils/throttle'

const app = getApp()
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
    let currentTarget = e.currentTarget 
    let num = currentTarget.dataset.num
    
    // 循环初始化样式
    for(let i=0; i<this.data.pileNum.length; i++){
      if(this.data.pileNum[i].disable){
        // ES6对象字面量赋值
        let obj = {
          ['pileNum[' + i + '].background']: 'rgba(35,198,117,0.6)',
          ['pileNum[' + i + '].color']: 'rgba(255,255,255,0.9)'
        }
        this.setData(obj)
      }else{
        let obj = {
          ['pileNum[' + i + '].background']: '#ffffff',
          ['pileNum[' + i + '].color']: '#23C675'
        }
        this.setData(obj)
      }
    }
    let obj = {
      ['pileNum[' + num + '].background']: '#23C675',
      ['pileNum[' + num + '].color']: '#ffffff'
    }
    this.setData(obj) // 设置数据

    // 选中端口
    let port = parseInt(this.data.pileNum[num].content) + 1
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
      res = res.data
      let port = /^(port)/
      let i = 0
      for(var item in res){
        if(port.test(item)){ // 正则去除id
          if(res[item] === 1){ // 端口号为0，代表未占用。1则为占用
            let obj = {
              ['pileNum[' + i + '].disable']: true,
              ['pileNum[' + i + '].color']: 'rgba(255,255,255,0.9)',
              ['pileNum[' + i + '].background']: 'rgba(35,198,117,0.6)'
            }
            this.setData(obj) 
          }
        i++       
        }
      }
      i = 0
    })
  },
  getUserInfo: function(e) {
    let that = this
    wx.getSetting({ // 查看是否授权
      success(res) {
        if (res.authSetting['scope.userInfo']) { // 是否授权 ==> 授权
          if(that.data.rechargePile.port){ // 是否选择端口 ==》 选择端口
            if(wx.getStorageSync('session3rd')){ // 是否注册 ==》 注册
              that.placeOrderAndPay(that, e) // 下单并支付
            }else{
              wx.getUserInfo({
                success(res) {
                  const userInfo = res.userInfo
                  throttle(() => { // 节流：减少用户点击支付按钮
                    wx.login({ // 获取code的值
                      success(res) {
                        request('POST','/api/login/login',{ // 注册
                          data:{
                            nickname: userInfo.nickName, // 用户姓名
                            headimgurl: userInfo.avatarUrl, // 用户头像
                            sex: userInfo.gender, // 性别
                            code: res.code  // 后台服务器解析用的code
                          }
                        })
                        .then(res => {
                          wx.setStorageSync('session3rd',res.data.session3rd)
                          that.placeOrderAndPay(that, e) // 下单并支付   
                        })
                      }
                    })
                  }, 4000, that)
                }
              })
            }
          }else{ // 用户未选择端口
            wx.showToast({
              title: '请选择对应端口，绿色按钮代表占用',
              icon: 'none',
              duration: 3000
            })
          }
        } else { // 未授权，提示用户授权
          wx.showToast({
            title: '请打开授权，否则无法支付',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },
  // 自定义函数
  placeOrderAndPay: function (that, e) {
    request('POST','/api/Build/buildOrder',{ // 下单
      header:{
        'session3rd':wx.getStorageSync('session3rd')
      },
      data:{
        id: that.data.rechargePile.id,
        port: that.data.rechargePile.port
      }
    })
    .then(res => { // 下单成功进行支付
      if(res.status === 0) { // 缓存登录态失效处理
        wx.removeStorageSync('session3rd')
        that.getUserInfo(e)
        return
      }
      pay(res.data)
    }) 
  }
})