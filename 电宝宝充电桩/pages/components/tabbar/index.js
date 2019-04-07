// pages/components/tabbar/index.js
Component({
  options:{
    multipleSlots: true //组件定义时选项中启用多slot支持
  },
  methods:{
    openScan() {
      wx.scanCode({
        success(res) {
          // 做跳转
          wx.navigateTo({
            url: res.path
          })
        }
      })
    }
  }
})