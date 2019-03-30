//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    show: false,
    actions: [
      {
        name: '选项'
      },
      {
        name: '分享',
        subname: '描述信息',
        openType: 'share'
      },
      {
        loading: true
      },
      {
        name: '禁用选项',
        disabled: true
      }
    ]
  },

  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    console.log(event.detail);
  },

  onCancel() {
    this.setData({ show: false })
  },

  show() {
    console.log('trigger')
    this.setData({ show: true})
  }

});
