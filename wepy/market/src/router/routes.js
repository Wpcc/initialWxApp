export function goProduct(id) { // 跳转商品详情
  wx.navigateTo({
    url: './product?id=' + id
  })
}

export function goOrder() { // 跳转订单
  wx.navigateTo({
    url: './order'
  })
}

export function goAddressAdd() { // 添加地址
  wx.navigateTo({
    url: './address-add'
  })
}
export function goAddressCompile(index) { // 编辑地址
  wx.navigateTo({
    url: './address-compile?num=' + index
  })
}
export function goAddressSelect() { // 选择地址
  wx.navigateTo({
    url: './address-select'
  })
}

export function goBack() { // 返回之前页面
  wx.navigateBack({
    delta: 1
  })
}

export function goOrderList() { // 订单列表
  wx.navigateTo({
    url: './orderList'
  })
}

export function goMine() { // 跳转个人中心
  wx.navigateTo({
    url: './mine'
  })
}
