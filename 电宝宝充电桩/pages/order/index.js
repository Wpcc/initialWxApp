// pages/order/index.js
import {request} from '../../api/request'
import {login} from '../../utils/login'
import {formatTime} from '../../utils/util'

Page({
  // 页面初始数据
  data: {
    leftSelected: true, // 配合html三元运算符控制左边选中样式
    page: 0, // 页码
    i: 0, // 数组push变量
    type: '1',
    piles: [], // 充电桩
    time: '', // 返回充电桩时间戳处理
    start: '', // 节流变量
    loading: true
  },
  ing_order() {
    this.setData({ // 重置
      leftSelected: true,
      piles:[],
      page: 0,
      i:0,
      type: '1',
      loading: true
    })
    this.getOrderList() // 获取进行时订单
  },
  ed_order() {
    this.setData({ 
      leftSelected: false,
      piles:[],
      page: 0,
      i:0,
      type:'2',
      loading: true
    })
    this.getOrderList() // 获取完成是订单
  },
  restart(e) {
    this.setData({
      loading: true
    })
    let i = e.currentTarget.dataset.i
    let orderNum = e.currentTarget.dataset.ordernum
    let now = +new Date()
    if(now - this.data.start > 3000){
      this.setData({ // 节流
        start:now
      })
      request('POST', '/api/Recharge/again', {
        header:{
          session3rd: wx.getStorageSync('session3rd')
        },
        data:{
          order_sn: orderNum
        }
      })
      .then(res => {
        this.setData({
          loading: false
        })
        if(res.status === 1){
          if(res.data.charge_status === 1) {
            wx.showToast({
              title: '异常已解决',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              ['piles[' + i + '].isAbnormal']: 2
            })
          }else {
            wx.showToast({
              title: '服务器繁忙，重新点击',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          console.log('解析错误')
        }
      })
    }
  },
  // 生命周期
  onShow: function () {
    this.getOrderList() // 获取进行时订单
  },
  // 页面事件处理
  onReachBottom() {
    let page = this.data.page
    this.setData({
      page: page + 1
    })
    this.getOrderList()
  },
  // 自定义函数
  getOrderList () {
    request('POST','/api/order/order_list',{
      header:{
        session3rd: wx.getStorageSync('session3rd')
      },
      data:{
        type:this.data.type,
        p:this.data.page
      }
    })
    .then((res) => { 
      if(res.status === 0) { // 本地登录态过期
        wx.removeStorageSync('session3rd')
        login(this.getOrderList, request)
        return
      }
      let i = this.data.i
      // 取消loading
      this.setData({
        loading: false
      })
      res = res.data // 进行中订单
      if(!res){
        return 
      } else {
        res.forEach(res => {
          let time = formatTime(new Date(res.ptime * 1000)) // 字符戳格式化
          let payPrice = res.pay_price.toString() + '.00' // 支付金额加0
          let obj = {
            ['piles[' + i + '].orderNum']: res.order_sn,
            ['piles[' + i + '].orderTime']: time,
            ['piles[' + i + '].address']: res.address,
            ['piles[' + i + '].pileNum']: res.device_sn,
            ['piles[' + i + '].timeRemaining']: res.stime,
            ['piles[' + i + '].payPrice']: payPrice,
            ['piles[' + i + '].isAbnormal']: res.port_status || 2
          }
          this.setData(obj)
          i ++
          this.setData({
            i:i
          })
        })
      }
    })
  }
})