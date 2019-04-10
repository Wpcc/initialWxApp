// pages/recharge/index.js
import {pay} from '../../utils/pay'
import {request} from '../../api/request'
import {checkAuthAndLogin} from '../../utils/util'
Page({
  data:{
    id:'', // 用户选择ID
    start:'', // 节流时间
    balance:'0',
    money:[]
  },
  onShow() {
    checkAuthAndLogin() // 检查是否登录注册
    request('POST', '/api/Center/personal', {
      header:{
        session3rd:wx.getStorageSync('session3rd')
      }
    })
    .then((res) => {
      if(res.status === 1){
        res = res.data
        let temp = []
        res.money.forEach(item => {
          item['color'] = '#23c675'
          item['background'] = '#fff'
          temp.push(item)
        })
        this.setData({
          money: temp,
          balance:res.balance
        })
      }
      console.log('money:' + JSON.stringify(res))
    })
  },
  changeStyle(e){
    for(let i = 0; i<this.data.money.length; i++){ // 初始化样式
      this.setData({
        ['money[' + i + '].color']:'#23c675',
        ['money[' + i + '].background']:'#fff'
      })
    }
    let i = e.currentTarget.dataset.i
    this.setData({
      ['money[' + i + '].color']:'#fff',
      ['money[' + i + '].background']:'#23c675',
      id: e.currentTarget.id
    })
  },
  onCharge() {
    if(!this.data.id){ // 如果用户未选择充值金额，提示
      wx.showToast({ // 未授权，提示用户授权
        title: '请选择充值金额，否则无法支付',
        icon: 'none',
        duration: 3000
      })
      return
    }
    this.placeOrderAndPay()
  },
  // 自定义函数
  placeOrderAndPay: function() {
    request('POST','/api/Build/chargeMoney', { // 下单
      header:{
        'session3rd':wx.getStorageSync('session3rd')
      },
      data:{
        btn_num: this.data.id
      }
    })
    .then(res => { // 下单成功进行支付
      if(res.status === 0) { // 缓存登录态失效处理
        wx.removeStorageSync('session3rd') // 清除缓存
        return
      }
      pay(res.data)
    }) 
  }
})