// pages/payment/index.js
import { tip } from '../../utils/tip'
import { request } from '../../api/request'
import { pay } from '../../utils/pay'
import { goPayTip,goBack,goIndex } from '../../router/routes'
import { login } from '../../utils/login'
import {recharge} from '../../utils/util'

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pile:{},
    pileNum:[],
    pileTime:[
      {id:0,background:'#fff',color:'#363636',content:'4小时/1.00元',img:'../../static/payment/icon_noCharge.png'},
      {id:1,background:'#fff',color:'#363636',content:'8小时/2.00元',img:'../../static/payment/icon_noCharge.png'},
    ],
    rechargePile:{ // 下单后的参数
      id:'',
      port:'',
      time:''
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
    ],
    param:{} // 获取端口号
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
  clickedPileTime: function(e) {
    let currentTarget = e.currentTarget 
    let num = currentTarget.dataset.num
    this.data.pileTime.forEach(item => { // 初始化样式
      this.setData({
        ['pileTime[' + item.id + '].background']: '#fff',
        ['pileTime[' + item.id + '].color']:'#363636',
        ['pileTime[' + item.id + '].img']: '../../static/payment/icon_noCharge.png'
      })
    })
    // 设置选中样式
    this.setData({
      ['pileTime[' + num + '].img']: '../../static/payment/icon_charged.png',
      ['pileTime[' + num + '].background']: '#23C675',
      ['pileTime[' + num + '].color']:'#fff'
    })
    // 选中端口
    let time = num +1
    this.setData({
      'rechargePile.time': time.toString()
    })
  },
  goBack,
  goIndex,
  // onLoad生命周期
  onLoad(option) {
    if(option.id){ // 通过小程序中ID进入
      this.setData({
        param:{
          data:{
            id:option.id
          }
        }
      })
    }else { // 通过扫码桩号进入
      this.setData({
        param:{
          data:{
            sn:option.scene
          }
        }
      })
    }
  },
  onShow(){
    this.initData()
    request('POST','/api/choiceport/index', this.data.param)
    .then(res => {
      res = res.data
      this.setData({ 
        'rechargePile.id': res.id.toString(), // 获取充电桩ID，后续支付使用
        pile:res // 将数据赋值给pile title数据渲染使用
      })
      let port = /^(port)/
      let temp = []
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
    })
  },
  getUserInfo: function(e) { // 授权操作
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) { // 是否授权 ==> 授权
          if(that.data.rechargePile.port && that.data.rechargePile.time){ // 是否选择端口 ==》 选择端口
            that.setData({  // 做弹出层
              show: true
            })
          }else{ // 用户未选择端口
            tip.error('请选择端口及充电时间，橘色按钮代表占用');
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
    return new Promise((resolve) => {
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
        port: this.data.rechargePile.port,
        type: this.data.rechargePile.time
      }
    })
    .then(res => { // 下单成功进行支付
      if(res.status === 0) { // 缓存登录态失效处理
        wx.removeStorageSync('session3rd') // 清除缓存
        this.loginThenOrder(this.wxPay)
        return
      }
      // 支付成功，重新发起充电：主要为了解决充电桩信号问题
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
        port: this.data.rechargePile.port,
        type: this.data.rechargePile.time
      }
    })
    .then(res => { // 下单成功进行支付
      if(res.status === 0) { // 余额不足
        tip.error(res.msg);
      } else {
        // 重新发起充电
        setTimeout(()=>{
          recharge(res.data.order_sn)
          tip.loaded()
        },1500)
        tip.success(res.msg);
        goPayTip();
      }
    }) 
  },
  initData(){
    this.setData({
      pile:{},
      pileNum:[],
      pileTime:[
        {id:0,background:'#fff',color:'#363636',content:'4小时/1.00元',img:'../../static/payment/icon_noCharge.png'},
        {id:1,background:'#fff',color:'#363636',content:'8小时/2.00元',img:'../../static/payment/icon_noCharge.png'},
      ],
      rechargePile:{ // 下单后的参数
        id:'',
        port:'',
        time:''
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
    })
  }
})