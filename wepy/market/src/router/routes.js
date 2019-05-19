export function goIndex() { // 跳转商品详情
  wx.navigateTo({
    url: './index'
  })
}

export function goProduct(id) { // 跳转商品详情
  wx.navigateTo({
    url: './product?id=' + id
  })
}

export function goOrder(id) { // 跳转订单
  console.log('id:' + JSON.stringify(id))
  wx.navigateTo({
    url: './order?id=' + id
  })
}

export function goAddressAdd() { // 添加地址
  wx.navigateTo({
    url: './address-add'
  })
}
export function goAddressCompile(index = 0) { // 编辑地址
  console.log(123)
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

export function onService() { // 客服处理
  wx.showModal({
    title: '客服',
    content: '人工热线：开通中',
    success(res) {
      console.log(res)
    }
  })
}
