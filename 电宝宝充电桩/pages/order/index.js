// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftSelected: true, // 配合html三元运算符控制左边选中样式
    rightSelected: false, // 右边选中样式
  },
  // 改变样式逻辑
  changeStyle: function (e) {
    if(e.currentTarget.id == 'tabbar-underway'){
      this.setData({
        leftSelected: true,
        rightSelected: false
      })
    }
    else if(e.currentTarget.id == 'tabbar-completed'){
      this.setData({
        leftSelected: false,
        rightSelected: true
      })
    }
  }
})