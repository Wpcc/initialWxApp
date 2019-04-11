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
    pile:{},
    pileNum:[],
    rechargePile:{ // 下单后的参数
      id:'',
      port:''
    },
    start: 0, // 节流时间变量
    // 第三方组件弹窗
    show: false,
    actions: [
      {
        name: '微信支付'
      },
      {
        name: '余额支付'
      }
    ]
  },
  clickedPileNum: function (e) {
    let currentTarget = e.currentTarget 
    let num = currentTarget.dataset.num
    if(currentTarget.dataset.status != 0){ // 端口异常，返回
      return
    }
    // 循环初始化样式
    this.data.pileNum.forEach(item => {
      if(item.status === 0){
        this.setData({
          ['pileNum[' + item.id + '].img']: '../../static/payment/icon_socket_normal.png'
        })
      }else{
        this.setData({
          ['pileNum[' + item.id + '].img']: '../../static/payment/icon_socket_used.png'
        })
      }
      this.setData({
        ['pileNum[' + item.id + '].background']: '#fff',
        ['pileNum[' + item.id + '].color']:'#363636'
      })
    })
    // 设置选中样式
    this.setData({
      ['pileNum[' + num + '].img']: '../../static/payment/icon_socket_selected.png',
      ['pileNum[' + num + '].background']: '#23C675',
      ['pileNum[' + num + '].color']:'#fff'
    })

    // 选中端口
    let port = num + 1
    this.setData({
      'rechargePile.port': port.toString()
    })
  },
  // onLoad生命周期
  onLoad(option) {
    let param = {}
    if(option.id){ // 通过小程序中ID进入
      param = {
        data:{
          id: option.id
        }
      }
    }else { // 通过扫码桩号进入
      param = {
        data: {
          sn: option.scene
        }
      }
    }
    request('POST','/api/choiceport/index', param)
    .then(res => {
      res = res.data
      this.setData({ 
        'rechargePile.id': res.id.toString(), // 获取充电桩ID，后续支付使用
        pile:res // 将数据赋值给pile title数据渲染使用
      })
      let port = /^(port)/
      let temp = []
      console.log(res)
      for(let key in res){
        if(port.test(key)){ // 正则去除id
          let obj = {}
          obj.id = parseInt(key.charAt(4))
          obj.showNum = '0' + key.charAt(4)
          obj.status = res[key]
          obj.img = res[key] == 0 ? '../../static/payment/icon_socket_normal.png' : '../../static/payment/icon_socket_used.png'
          obj.background = '#fff'
          obj.color = '#363636'
          temp.push(obj)   
        }
      }
      this.setData({
        pileNum:temp
      })
      console.log(this.data.pileNum)
    })
  },
  getUserInfo: function(e) { // 授权操作
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) { // 是否授权 ==> 授权
          if(that.data.rechargePile.port){ // 是否选择端口 ==》 选择端口
            that.setData({  // 做弹出层
              show: true
            })
          }else{ // 用户未选择端口
            wx.showToast({
              title: '请选择对应端口，橘色按钮代表占用',
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
  // 第三方组件事件
  onClose: function () {
    this.setData({
      show: false
    })
  },
  onSelect: function (e) {
    let that = this
    if(e.detail.name === '微信支付'){
      this.loginThenOrder(this.wxPay) // 登录、支付
    }
    else if(e.detail.name === '余额支付'){
      wx.showModal({
        title: '提示',
        content: '确认使用余额支付',
        success(res) {
          if (res.confirm) {
            that.loginThenOrder(that.balancePay)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    this.onClose()  // 关闭弹窗
  },
  // 支付流程
  loginThenOrder: function(wxPay) {
    const that = this
    if(wx.getStorageSync('session3rd')){ // 是否注册 ==》 注册
      wxPay() // 下单并支付
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
                  wxPay() // 下单并支付   
                })
              }
            })
          }, 4000, that)
        }
      })
    }
  },
  wxPay: function() { // 微信支付
    request('POST','/api/Build/buildOrder', { // 下单
      header:{
        'session3rd':wx.getStorageSync('session3rd')
      },
      data:{
        id: this.data.rechargePile.id,
        port: this.data.rechargePile.port
      }
    })
    .then(res => { // 下单成功进行支付
      if(res.status === 0) { // 缓存登录态失效处理
        wx.removeStorageSync('session3rd') // 清除缓存
        this.loginThenOrder(this.wxPay)
        return
      }
      pay(res.data)
    }) 
  },
  balancePay: function() { // 余额支付
    request('POST','/api/Payment/yePay', { // 下单
      header:{
        'session3rd':wx.getStorageSync('session3rd')
      },
      data:{
        id: this.data.rechargePile.id,
        port: this.data.rechargePile.port
      }
    })
    .then(res => { // 下单成功进行支付
      if(res.status === 0) { // 余额不足
        if(res.msg === "未登录"){
          wx.removeStorageSync('session3rd')
          this.loginThenOrder(this.balancePay)
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
        }
        return
      }
    }) 
  }
})