// pages/list/index.js
const app = getApp();
Page({
    data: {
        FocusTrue: true, // 焦距显示
        inputVal: ""
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    // 点击输入框，给全局变量赋值
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        })
    },
    // 点击搜索logo或键盘完成===》跳转到首页
    goBack: function () {
        app.globalData.listInput = this.data.inputVal
        wx.navigateBack({
            delta: 1
        })
    },  
    /**
     * 生命周期函数
     */
    // 页面显示时，初始化input的值
    onShow: function () {
        this.setData({
            inputVal:app.globalData.listInput
        })
    }
});