// pages/payment/index.js
import {request} from '../../utils/request'
import {pay} from '../../utils/pay'
import {throttle} from '../../utils/throttle'
import {tip} from '../../utils/tip'
import {goOrder} from '../../utils/routes'

const App = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    radio:'0',
    money:[
      {
        id:"1",
        color:"#fff",
        background:"#32cd32",
        time:"4",
        money:"0.01"
      },
      {
        id:"2",
        color:"#323232",
        background:"#fff",
        time:"6",
        money:"0.02"
      },
      {
        id:"3",
        color:"#323232",
        background:"#fff",
        time:"8",
        money:"0.03"
      }
    ],
    clickedMoney: '0.01',
    navH: App.globalData.navHeight,
    pile:{},
    start:0 // 节流时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ['pile.i']: options.i,
      ['pile.name']: options.name,
      ['pile.device_no']: options.device_no,
      ['pile.id']: options.id
    })
  },
  onChange(event){
    this.setData({
      radio:event.detail
    })
  },
  changeStyle(e){
    for(let i = 0; i<this.data.money.length; i++){ // 初始化样式
      this.setData({
        ['money[' + i + '].color']:'#323232',
        ['money[' + i + '].background']:'#fff'
      })
    }
    let i = e.currentTarget.dataset.i
    this.setData({
      ['money[' + i + '].color']:'#fff',
      ['money[' + i + '].background']:'#32cd32',
      clickedMoney: this.data.money[i].money
    })
  },
  onClick(event){
    const {name} = event.currentTarget.dataset;
    this.setData({
      radio:name
    })
  },
  onPayment(){
    let that = this
    throttle(that.packPayment, 2000, that)
  },
  packPayment(){
    request('POST','/api/order/addOrder',{
      header:{
        session3rd: wx.getStorageSync('session3rd')
      },
      data:{
        total_fee: this.data.clickedMoney,
        device_id: this.data.pile.id,
        order_type: '0',
        pay_type: this.data.radio,
        port: this.data.pile.i,
      }
    })
    .then(res => {
      if(this.data.radio == 0){ // 微信支付
        pay(res.data, goOrder)
      }
      else if(this.data.radio == 1) { //余额支付
        if(res.status === 0) { // 余额不足
          tip.error('您的账户余额不足')
        } else if (res.status ===1) { //支付成功跳转
          request('POST', '/api/device/deviceC', {
            header:{
              session3rd: wx.getStorageSync('session3rd')
            },
            data:{
              device_sn:res.data.options.device_sn,
              port:res.data.options.port,
              order_no:res.data.options.order_no,
              pay_price:res.data.options.pay_price,
              balance:res.data.options.balance
            }
          })
          goOrder(res.data.order_id)
        }
      }
    })
  }
})