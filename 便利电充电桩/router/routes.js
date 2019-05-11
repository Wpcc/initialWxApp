// 跳转列表页
export function goList() {
  wx.getSetting({
    success(res) {
      if(res.authSetting['scope.userLocation']){ // 如果用户授权
        wx.navigateTo({
            url: '../list/index'
        })
      }else{
        wx.showModal({
          title:'提示',
          content:'需要获取到您的地址，才能进行准备定位',
          success(res){
            if(res.confirm){
              wx.openSetting()
            }else if(res.cancel){
              // 不做任何操作
            }
          }
        })
      }
    }
  })
}

// 跳转主页
export function goIndex() {
  wx.redirectTo({
    url: '../index/index'
  })
}

// 跳转到分享
export function goShare() {
  wx.redirectTo({
    url:'../share/index'
  })
}

// 跳转商城
export function goStore(){
  wx.showToast({
    title: '开发中，请等待',
    icon: 'none',
    duration: 2000
  })
}

// 跳转红包
export function goRedPacket(){
  wx.showToast({
    title: '开发中，请等待',
    icon: 'none',
    duration: 2000
  })
}

// 充值
export function goRecharge() {
  wx.getSetting({
    success(res) {
      if(!res.authSetting['scope.userInfo'] || !wx.getStorageSync('session3rd') ) { // 如果用户授权
        wx.showToast({
          title:'点击个人中心进行授权，才能进行该操作',
          icon:'none',
          dutation:2000
        })
      }
      else{
        wx.navigateTo({
          url: '../recharge/index'
        })
      }
    }
  })
}

// 充值记录
export function goRecord() {
  wx.navigateTo({
    url: '../record/index'
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

// 支付成功页
export function goPayTip() {
  wx.navigateTo({
    url: '../paysuccess/index'
  });
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
