// pages/payment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pileNum:[
      { id: 0, content: '0', background: '#ffffff', color: '#23C675' },
      { id: 1, content: '1', background: '#ffffff', color: '#23C675' },
      { id: 2, content: '2', background: '#ffffff', color: '#23C675' },
      { id: 3, content: '3', background: '#ffffff', color: '#23C675' },
      { id: 4, content: '4', background: '#ffffff', color: '#23C675' },
      { id: 5, content: '5', background: '#ffffff', color: '#23C675' },
      { id: 6, content: '6', background: '#ffffff', color: '#23C675' },
      { id: 7, content: '7', background: '#ffffff', color: '#23C675' },
      { id: 8, content: '8', background: '#ffffff', color: '#23C675' },
      { id: 9, content: '9', background: '#ffffff', color: '#23C675' }
    ]
  },
  clickedPileNum: function (e) {
    // 通过数据模拟循环设置数据
    for(let i=0; i<this.data.pileNum.length; i++){
      var obj = {}
      var background = 'pileNum[' + i + '].background'
      var color = 'pileNum[' + i + '].color'
      obj[background] = '#ffffff' 
      obj[color] = '#23C675'
      this.setData(obj)
    }
    var obj = {}
    var background = 'pileNum[' + e._relatedInfo.anchorRelatedText + ']background'
    var color = 'pileNum[' + e._relatedInfo.anchorRelatedText + '].color'
    obj[background] = '#23C675'
    obj[color] = '#ffffff'
    this.setData(obj)
    console.log(e._relatedInfo.anchorRelatedText) //获取点击按钮的值
  }
})