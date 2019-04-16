// pages/payment/index.js
import { tip } from '../../utils/tip'
import { request } from '../../api/request'
import { pay } from '../../utils/pay'
import { throttle } from '../../utils/throttle'
import { goPayTip } from '../../router/routes'
import { login } from '../../utils/login'

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
            tip.error('请选择对应端口，橘色按钮代表占用');
          }
        } else { // 未授权，提示用户授权
          tip.error('请打开授权，否则无法支付');
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
      tip.loading('正在支付中...');
      that.loginThen().then(res => {
        if(res) {
          that.wxPay();
        }else{
          tip.error('支付失败!');
        }
      });
    }
    else if(e.detail.name === '余额支付'){
      tip.confirm('确认使用余额支付').then(data => {
        if (data) {
          tip.loading('正在支付中...');
          that.loginThen().then(res => {
            if(res) {
              that.balancePay();
            }else {
              tip.error('支付失败!');
            }
          });
        } else {
          console.log('用户点击取消')
        }
      });
    }
    this.onClose()  // 关闭弹窗
  },
  loginThen: function() {
    tip.loading();
    return new Promise((resolve, reject) => {
      login().then(res => {
          resolve(res);
      });
    });
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
      tip.loaded();
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
      tip.loaded();
      if(res.status === 0) { // 余额不足
        tip.error(res.msg);
      } else {
        tip.success(res.msg);
        goPayTip();
      }
    }) 
  },
})