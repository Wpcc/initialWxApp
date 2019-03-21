//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    inputShowed: false, // 控制input初始化显示
    inputVal: "",
    disabledTrue: true, // 禁止input聚焦 
    painTrue: true,
    /* 坐标 */
    longitude:114.207034,
    latitude:30.550434,
    markers:[] //需要做对应处理
  },
  goList: function () {
    wx.navigateTo({
      url: '../list/index'
    })
  },
  goRecharge: function () {
    wx.navigateTo({
      url: '../recharge/index'
    })
  },
  goInstruction: function () {
    wx.navigateTo({
      url: '../instruction/index'
    })
  },
  goMine() {
    wx.navigateTo({
      url: '../mine/index'
    })
  },
  /**
   * 生命周期函数 
   * 
   * */
  onShow: function () {
    // 打印url参数
    if (app.globalData.listInput) {
      this.setData({
        inputShowed: true,
        inputVal: app.globalData.listInput
      })
    } else {
      this.setData({
        inputShowed: false,
        inputVal: ""
      })
    }
  },
  // 加载用户位置，将数据放入到全局变量当中
  onLoad: function () {
    var that = this
    wx.getLocation({
      type:'gcj02',
      success(res){
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        }),
        wx.request({
          url:'https://backend.quanjieshop.com/api/Homepage/index',
          method:'POST',
          data:{
            lng: res.longitude,
            lat: res.latitude
          },
          success(res) {
            var res = res.data
            var i = 0
            res.data.forEach(item => {
              // 坐标点固定的值
              var fixedIconPath = '../../static/images/position_go.png'
              var fixedWidth = 40
              var fixedHeight = 38
              //  坐标点转数字
              var longitudeNum = parseFloat(item.lng)
              var latitudeNum = parseFloat(item.lat)

              var longitude = 'markers[' +　i + '].longitude'
              var latitude = 'markers[' + i + '].latitude'
              var id = 'markers[' + i + '].id'
              var iconPath = 'markers[' + i + '].iconPath'
              var width = 'markers[' + i + '].width'
              var height = 'markers[' + i + '].height'
              
              that.setData({
                [longitude]:longitudeNum,
                [latitude]:latitudeNum,
                [id]:item.id,
                [iconPath]:fixedIconPath,
                [width]:fixedWidth,
                [height]:fixedHeight
              })
              i++
            })
          }
        })
      },
      fail (err) {
        wx.showToast({
          title: '请打开位置授权，否则无法正确的导航地图',
          icon: 'none',
          duration: 3000
        })
      }
    })
  }
  
  
});