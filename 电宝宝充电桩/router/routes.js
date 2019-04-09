// 跳转列表页
export function goList() {
  wx.navigateTo({
      url: '../list/index'
  })
}

// 跳转主页
export function goIndex() {
  wx.redirectTo({
    url: '../index/index'
  })
}

// 跳转客服
export function goService() {
  wx.navigateTo({
    url:'../service/index'
  })
}

// 充值
export function goRecharge() {
  wx.navigateTo({
    url: '../recharge/index'
  })
}

// 跳转说明页
export function goInstruction() {
  wx.navigateTo({
      url: '../instruction/index'
  })
}

// 跳转个人中心
export function goMine() {
  wx.navigateTo({
      url: '../mine/index'
  })
}

// 回退
export function goBack() {
  wx.navigateBack({
    delte:1
  })
}

// 订单页
export function goOrder() {
  wx.navigateTo({
    url:'../order/index'
  })
}

// 点击列表页，跳转到产品详情页
export function goProduct (e) {
  // 获取DOM自定义数据
  let id = ''
  // 获取DOM自定义数据
  if (e.markerId){
    id = e.markerId
  }else {
    id = e.currentTarget.dataset.id
  }
  // 通过url传值
  wx.navigateTo({
    url: '../product/index?id=' + id // 赋带详细充电桩坐标
  })
}
// url longitude latitude addredd de
