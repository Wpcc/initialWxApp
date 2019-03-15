//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
      inputShowed: false, // 控制input初始化显示
      inputVal: "",
      disabledTrue: true, // 禁止input聚焦 
      painTrue: true
  },
  goList: function () {
      wx.navigateTo({
          url:'../list/index'
      })
  },
/**
 * 生命周期函数 
 * 
 * */   
  onShow: function () {
    // 打印url参数
    if(app.globalData.listInput){
        this.setData({
            inputShowed:true,
            inputVal:app.globalData.listInput
        })
    }else{
        this.setData({
            inputShowed: false,
            inputVal:""
        })
    }
  }
});
