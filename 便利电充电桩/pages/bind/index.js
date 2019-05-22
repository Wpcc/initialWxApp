// pages/bind/index.js
import {request} from '../../api/request'
Page({
  data:{
    cardNum:''
  },
  onBindCard(){
    request('POST','/api/vircard/bind',{
      header:{
        session3rd:wx.getStorageSync('session3rd')
      },
      data:{
        card_no:this.data.cardNum
      }
    })
    .then(res => {
      console.log(res)
    })
  },
  onUnBindCard() {
    request('POST', '/api/vircard/unbind', {
      header: {
        session3rd: wx.getStorageSync('session3rd')
      }
    })
      .then(res => {
        console.log(res)
      })
  },
  onChange(value){
    this.setData({
      cardNum:value.detail
    })
  }
})