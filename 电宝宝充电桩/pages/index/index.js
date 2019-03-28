//index.js
//获取应用实例
import {goList, goRecharge, goInstruction, goMine} from '../../router/routes'
import {request} from '../../api/request'
const app = getApp()
Page({
    data: {
        inputShowed: false, // 控制input初始化文字提示显示
        inputVal: "",
        disabledTrue: true, // 禁止input聚焦 
        painTrue: true,
        /* 坐标 */
        longitude: 114.207034,
        latitude: 30.550434,
        markers: [] //需要做对应处理
    },
    // 路由
    goList,
    goRecharge,
    goInstruction,
    goMine,
    // 生命周期函数
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
            type: 'gcj02',
            success(res) {
                // 存全局data中
                app.globalData.longitude = res.longitude
                app.globalData.latitude = res.latitude

                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude
                })
                request('POST','/api/Homepage/index',{
                  data:{
                    lng: res.longitude,
                    lat: res.latitude
                  }
                })
                .then(res => {
                  res = res.data
                  let i = 0
                  res.forEach(item => {
                    // let obj = { // 设置markers
                    //   ['markers[' + i + '].longitude']: parseFloat(item.lng),
                    //   ['markers[' + i + '].latitude']: parseFloat(item.lat),
                    //   ['markers[' + i + '].id']: item.id,
                    //   ['markers[' + i + '].iconPath']: '../../static/images/position_go.png',
                    //   ['markers[' + i + '].width']: 40,
                    //   ['markers[' + i + '].height']: 38
                    // }
                    // that.setData(obj)
                    /**
                     * value内容
                     */
                    // 坐标点固定的值
                    var fixedIconPath = '../../static/images/position_go.png'
                    var fixedWidth = 40
                    var fixedHeight = 38
                    //  坐标点转数字
                    var longitudeNum = parseFloat(item.lng)
                    var latitudeNum = parseFloat(item.lat)
                    /**
                     * key内容
                     */
                    var longitude = 'markers[' + i + '].longitude'
                    var latitude = 'markers[' + i + '].latitude'
                    var id = 'markers[' + i + '].id'
                    var iconPath = 'markers[' + i + '].iconPath'
                    var width = 'markers[' + i + '].width'
                    var height = 'markers[' + i + '].height'

                    that.setData({
                        [longitude]: longitudeNum,
                        [latitude]: latitudeNum,
                        [id]: item.id,
                        [iconPath]: fixedIconPath,
                        [width]: fixedWidth,
                        [height]: fixedHeight
                    })
                    i++
                  })
                })
            },
            fail(err) {
                wx.showToast({
                    title: '请打开位置授权，否则无法正确定位',
                    icon: 'none',
                    duration: 3000
                })
            }
        })
    }


});