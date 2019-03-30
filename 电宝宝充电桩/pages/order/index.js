// pages/order/index.js
import {request} from '../../api/request'
import {login} from '../../utils/login'
import {formatTime} from '../../utils/util'

Page({
  // 页面初始数据
  data: {
    leftSelected: true, // 配合html三元运算符控制左边选中样式
    piles:[], // 充电桩
    time:'', // 返回充电桩时间戳处理
    start: '' // 节流变量
  },
  ing_order() {
    this.setData({
      leftSelected: true
    })
    this.setData({ // 重置piles
      piles:[]
    })
    this.getOrderList('1') // 获取进行时订单
  },
  ed_order() {
    this.setData({
      leftSelected: false
    })
    this.setData({ // 重置piles
      piles:[]
    })
    this.getOrderList('2') // 获取完成是订单
  },
  restart(e) {
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
        console.log(this.data.start)
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
    this.getOrderList('1') // 获取进行时订单
  },
  // 自定义函数
  getOrderList (type) {
    request('POST','/api/order/order_list',{
      header:{
        session3rd: wx.getStorageSync('session3rd')
      },
      data:{
        type:type
      }
    })
    .then((res) => { 
      if(res.status === 0) { // 本地登录态过期
        wx.removeStorageSync('session3rd')
        login(this.getOrderList, request)
        return
      }
      res = res.data // 进行中订单
      for(let i = 0; i < res.length; i++){
        let time = formatTime(new Date(res[i].ptime * 1000)) // 字符戳格式化
        let payPrice = res[i].pay_price.toString() + '.00' // 支付金额加0
        let obj = {
          ['piles[' + i + '].orderNum']: res[i].order_sn,
          ['piles[' + i + '].orderTime']: time,
          ['piles[' + i + '].address']: res[i].address,
          ['piles[' + i + '].pileNum']: res[i].device_sn,
          ['piles[' + i + '].timeRemaining']: res[i].stime,
          ['piles[' + i + '].payPrice']: payPrice,
          ['piles[' + i + '].isAbnormal']: res[i].port_status || 2
        }
        this.setData(obj)
      }
    })
  }
})