// pages/order/index.js
import {request} from '../../api/request'
import {login} from '../../utils/login'
import {formatTime} from '../../utils/util'
Page({
  // 页面初始数据
  data: {
    leftSelected: true, // 配合html三元运算符控制左边选中样式
    piles:[], // 充电桩
    time:'' // 返回充电桩时间戳处理
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
    console.log(e)
    let i = e.currentTarget.dataset.i
    let orderNum = e.currentTarget.dataset.ordernum
    request('POST', '/api/Recharge/again', {
      header:{
        session3rd: wx.getStorageSync('session3rd')
      },
      data:{
        order_sn: orderNum
      }
    })
    .then(res => {
      if(res.status === 1){
        wx.showToast({
          title: '异常已解决',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          ['piles[' + i + '].isAbnormal']: 2
        })
      } else {

      }
    })
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
        login(getOrderList, request)
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
      console.log(JSON.stringify(this.data.piles))
    })
  }
})