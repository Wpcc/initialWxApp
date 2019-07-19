export function goIndex() { // 跳转主页，并关闭所有后台页面
  wx.reLaunch({
    url:'../index/index'
  })
}

export function goBack() { // 回退
  wx.navigateBack({
    delte:1
  })
}

export function goLogin() { // 进入登录页
  wx.navigateTo({
    url: '/pages/login/index',
  })
}

export function goPayment(pile) {
  console.log(pile)
  wx.navigateTo({
    url: '/pages/payment/index?' + pile
  })
}

export function goOrder(orderNum) {
  console.log(orderNum)
  wx.navigateTo({
    url: '/pages/order/index?order_id=' + orderNum
  })
}

export function goSocket() { // 进入主页
  wx.navigateTo({
    url: '/pages/socket/index',
  })
}