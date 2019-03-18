// pages/payment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pileNum:[
      { id: 0, content: '0' },
      { id: 1, content: '1' },
      { id: 2, content: '2' },
      { id: 3, content: '3' },
      { id: 4, content: '4' },
      { id: 5, content: '5' },
      { id: 6, content: '6' },
      { id: 7, content: '7' },
      { id: 8, content: '8' },
      { id: 9, content: '9' },
    ],
  },
  clickedPileNum: function (e) {
    console.log(e)
    console.log(e._relatedInfo.anchorRelatedText) //获取点击按钮的值
  }
})