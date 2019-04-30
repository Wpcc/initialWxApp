export function service(){
  wx.showModal({
    title: '客服',
    content: '人工热线：123456',
    success(res) {
      if (res.confirm) {
        wx.makePhoneCall({
          phoneNumber:'123456'
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}