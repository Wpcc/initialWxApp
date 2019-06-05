// pages/bind/index.js
import {request} from '../../api/request'
import tip from '../../utils/tip'
Page({
  data:{
    cardNum:''
  },
  onBindCard(){
    if(!this.data.cardNum){
      tip.alert('卡号不能为空')
    }
    request('POST','/api/vircard/bind',{
      header:{
        session3rd:wx.getStorageSync('session3rd')
      },
      data:{
        card_no:this.data.cardNum
      }
    })
    .then(res => {
      if(res.status === 1){
        this.setData({
          cardNum: res.card_no
        })
        tip.alert('绑卡成功')
      }else{
        tip.alert(res.data.msg)
      }
    })
  },
  onUnBindCard() {
    request('POST', '/api/vircard/unbind', {
      header: {
        session3rd: wx.getStorageSync('session3rd')
      }
    })
    .then(res => {
      if(res.status === 1){
        this.setData({
          cardNum:''
        })
        tip.alert('解绑成功')
      }else{
        tip.alert(res.data.msg)
      }
    })
  },
  onChange(value){
    this.setData({
      cardNum:value.detail
    })
  },
  onShow(){
    request('POST','/api/vircard/index',{
      header:{
        session3rd:wx.getStorageSync('session3rd')
      }
    }).then(res => {
      this.setData({
        cardNum:res.data.card_no
      })
    })
  }
})