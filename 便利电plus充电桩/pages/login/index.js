//index.js
//获取应用实例
import {request} from '../../utils/request'
import {goBack} from '../../utils/routes'
const app = getApp()

Page({
  data: {

  },
  // 路由
  goBack,
  onLoad: function () {
   
  },
  getPhoneNumber(e) {
    request('POST','/api/user/info',{
      header:{
        session3rd:wx.getStorageSync('session3rd')
      },
      data:{
        iv: e.detail.iv || '',
        encryptedData: e.detail.encryptedData || ''
      }
    })
    .then(res => {
      console.log('hello')
      if(res.status === 1){
        wx.setStorageSync('getPhone',1)
        goBack()
      }
    })
  }
  
})
