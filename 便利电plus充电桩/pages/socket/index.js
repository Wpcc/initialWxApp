// pages/socket/index.js
import {request} from '../../utils/request'
import {goLogin, goPayment} from '../../utils/routes'
import {tip} from '../../utils/tip'
const App = getApp()
Page({

  data: {
    navH: App.globalData.navHeight,
    socket: {},
    user: {},
    example:''
  },

  onShow: function () {
    if(!wx.getStorageSync('session3rd')){ //获取登录态
      wx.login({ 
        success(res) {
          if(res.code){
            request('POST','/api/user/login',{
              data:{
                code: res.code
              }
            }).then(res => {
              wx.setStorageSync('session3rd',res.data.session3rd)
            })
          }else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
    request('get','/api/device/info',{
      data:{
        sn:10001
      }
    }).then(res => {
      this.setData({
        socket:res.data
      })
    })
  },
  getPhone(e){
    let pile = `i=${e.currentTarget.dataset.index + 1}&name=${this.data.socket.name}&device_no=${this.data.socket.device_no}&id=${this.data.socket.id}`
    if(!wx.getStorageSync('getPhone')){
      goLogin()
    }
    else{
      goPayment(pile)
    }
  },
  showToast(){
    tip.alert('端口占用，请重新选择')
  },
  showErr(){
    tip.confirm('故障电话：15271931003', {} ,'人工热线')
    .then(res => {
      if(res === 1){
        this.call()
      }
    })
  },
  call(){
    wx.makePhoneCall({
      phoneNumber:'15271931003'
    })
  }
})