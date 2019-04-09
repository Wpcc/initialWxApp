//index.js
//获取应用实例
import {goList, goRecharge, goInstruction, goMine, goProduct} from '../../router/routes'
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
        markers: [] // 需要做对应处理
    },
    // 路由
    goList,
    goRecharge,
    goInstruction,
    markersGo(e) {
      goProduct(e)
    },
    // 悬浮按钮
    location() {
      let that = this
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude
          })
        }
      })
    },
    scan() {
      wx.scanCode({
        success(res) {
          // 做跳转
          console.log(res.path)

          wx.navigateTo({
            url: '/' + res.path
          })
        }
      })
    },
    bindGetUserInfo(e) {
      wx.getSetting({
        success(res) {
          if(res.authSetting['scope.userInfo']) { // 用户授权
            if(wx.getStorageSync('session3rd')) { // 用户注册
              goMine()
            }else {
              const userInfo = e.detail.userInfo
              wx.login({ // 获取code的值
                success(res) {
                  request('POST', '/api/login/login', {
                    data:{
                      nickname: userInfo.nickName, // 用户姓名
                      headimgurl: userInfo.avatarUrl, // 用户头像
                      sex: userInfo.gender, // 性别
                      code: res.code  // 后台服务器解析用的code
                    }
                  })
                  .then(res => {
                    wx.setStorageSync('session3rd',res.data.session3rd) // 保存用户登录凭证
                    goMine()
                  })
                }
              })
            }
          }
        }
      })
    },
    // 加载用户位置，将数据放入到全局变量当中
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
        let that = this
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
                    let obj = { // 设置markers
                      ['markers[' + i + '].longitude']: parseFloat(item.lng),
                      ['markers[' + i + '].latitude']: parseFloat(item.lat),
                      ['markers[' + i + '].id']: item.id,
                      ['markers[' + i + '].iconPath']: '../../static/images/position_go.png',
                      ['markers[' + i + '].width']: 40,
                      ['markers[' + i + '].height']: 38
                    }
                    that.setData(obj)
                    i++
                  })
                })
            },
            fail() {
                wx.showToast({
                    title: '请打开位置授权，否则无法正确定位',
                    icon: 'none',
                    duration: 3000
                })
            }
        })
    }
});