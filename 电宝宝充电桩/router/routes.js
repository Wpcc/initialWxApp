// 跳转列表页
export function goList() {
  wx.navigateTo({
      url: '../list/index'
  })
}

// 跳转充电页
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

export function goOrder() {
  wx.navigateTo({
    url:'../order/index'
  })
}