// 跳转列表页
export function goList() {
  wx.navigateTo({
      url: '../list/index'
  })
}

// 充值
export function goRecharge() {
  wx.getSetting({
    success(res) {
      if(res.authSetting['scope.userInfo']) { // 如果用户授权
        if(wx.getStorageSync('session3rd')){
          wx.navigateTo({
            url: '../recharge/index'
          })
        }else{
          wx.showToast({
            title: '你需要到个人中心进行授权，才能进行该操作',
            icon: 'none',
            duration: 3000
          })
        }
      }else{
        wx.showToast({
          title: '你需要到个人中心进行授权，才能进行该操作',
          icon: 'none',
          duration: 3000
        })
      }
    }
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
  wx.getSetting({
    success(res) {
      if(res.authSetting['scope.userInfo']) { // 如果用户授权
        if(wx.getStorageSync('session3rd')){
          wx.navigateTo({
            url:'../order/index'
          })
        }else{
          wx.showToast({
            title: '你需要到个人中心进行授权，才能进行该操作',
            icon: 'none',
            duration: 3000
          })
        }
      }else{
        wx.showToast({
          title: '你需要到个人中心进行授权，才能进行该操作',
          icon: 'none',
          duration: 3000
        })
      }
    }
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
    url: '../product/index?longitude=' + longitude + '&latitude=' + latitude 
    + '&address=' + address + '&deviceNum=' + deviceNum + '&port=' + port
    + '&id=' + id//赋带详细充电桩坐标
  })
}
