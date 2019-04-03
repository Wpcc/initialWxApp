const app = getApp()

Page({
  data: {
    centerLoading: true                
  },
  onLoad: function () {
    
  },
  changeData() {
    this.setData({
      centerLoading: false
    })
    console.log(this.data.centerLoading)
  }
})
