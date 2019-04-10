// pages/record/index.js
import { request } from '../../api/request'
import { formatTime } from '../../utils/util'
import { checkAuthAndLogin } from '../../utils/util'
Page({
  data:{
    p:1, // 分页
    record:[],
    bottomLoading: false,
    centerLoading: true,
    noData: false
  },
  // 页面事件处理
  onReachBottom() {
    if(this.data.noData){ // 如果没数据，返回
      return
    }

  },
  onShow(){
    checkAuthAndLogin()
    request('POST', '/api/order/recharge',{
      header:{
        session3rd:wx.getStorageSync('session3rd')
      },
      data:{
        p:1
      }
    })
    .then((res) => {
      if(res.status != 1){
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
        return
      }
      res = res.data
      let temp = []
      res.forEach(item => {
        if(item.status === 1){
          item.status = '待支付'
          item.color = '#FD7727'
        }else if(item.status === 2){
          item.status = '已支付'
          item.color = '#23C675'
        } else if (item.status === 6){
          item.status = '已取消'
          item.color = '#999'
        }
        item.ctime = formatTime(new Date(item.ctime * 1000))
        temp.push(item)
      })
      this.setData({
        record:temp
      })
      console.log('record:' + JSON.stringify(this.data.record))
    })
  },
  // 自定义函数
  pullDownLoad(res) {
    if(res.length === 0) {
      this.setData({
        bottomLoading: true,
        noData: true
      })
    } else if(res.length > 0) {
      this.setData({
        bottomLoading: true,
        noData: false
      })
    }
  }
})