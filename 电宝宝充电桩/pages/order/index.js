// pages/order/index.js
import {request} from '../../api/request'
import {login} from '../../utils/login'
Page({
  // 页面初始数据
  data: {
    leftSelected: true, // 配合html三元运算符控制左边选中样式
    piles:[]
  },
  // 改变样式逻辑
  changeStyle: function (e) {
    if(e.currentTarget.id == 'tabbar-underway'){
      this.setData({
        leftSelected: true
      })
    }
    else if(e.currentTarget.id == 'tabbar-completed'){
      this.setData({
        leftSelected: false
      })
    }
  },
  // 生命周期
  onShow: function getOrderList(){
    request('POST','/api/order/order_list',{
      header:{
        session3rd:wx.getStorageSync('session3rd')
      },
      data:{
        type:'1'
      }
    })
    .then((res) => { 
      if(res.status === 0) { // 本地登录态过期
        wx.removeStorageSync('session3rd')
        login(getOrderList, request)
        return
      }
      res = res.data // 进行中订单
      this.setData({
        piles: res
      })
      console.log(JSON.stringify(this.data.piles))
    })
  }
})