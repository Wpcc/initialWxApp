// 跳转列表页
export function goList() {
  wx.navigateTo({
    url: './list'
  })
}

// 跳转充电页
export function goRecharge() {
  wx.navigateTo({
    url: './recharge'
  })
}

// 跳转说明页
export function goInstruction() {
  wx.navigateTo({
    url: './instruction'
  })
}

// 跳转个人中心
export function goMine() {
  console.log('goMine')
  wx.navigateTo({
    url: './mine'
  })
}

// 回退
export function goBack() {
  wx.navigateBack({
    delte: 1
  })
}

export function goOrder() {
  wx.navigateTo({
    url: './order'
  })
}

// 点击列表页，跳转到产品详情页
export function goProduct (e) {
  // 获取DOM自定义数据
  var id = e.currentTarget.dataset.id
  var longitude = e.currentTarget.dataset.longitude
  var latitude = e.currentTarget.dataset.latitude
  var address = e.currentTarget.dataset.address
  var deviceNum = e.currentTarget.dataset.devicenum
  var port = e.currentTarget.dataset.port

  // 通过url传值
  wx.navigateTo({
    url: './product?longitude=' + longitude + '&latitude=' + latitude +
    '&address=' + address + '&deviceNum=' + deviceNum + '&port=' + port +
    '&id=' + id// 赋带详细充电桩坐标
  })
}
