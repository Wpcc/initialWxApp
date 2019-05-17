import {goBack} from '../router/routes'
export default class Address {
  static addToLocalStorage(data) { // 添加地址到本地存储
    let userAddressList = wx.getStorageSync('userAddressList') ? JSON.parse(wx.getStorageSync('userAddressList')) : []
    if (userAddressList.length > 0) { // 将以前地址修改未选中
      userAddressList.forEach((item) => {
        item.select = false
      })
    }
    userAddressList.push(data)
    wx.setStorageSync('userAddressList', JSON.stringify(userAddressList))
    goBack()
  }

  static getFromLocalStorage(type = 'userAddressList') { // 是返回选中地址对象还是所有数组
    let userAddressList = wx.getStorageSync('userAddressList') ? JSON.parse(wx.getStorageSync('userAddressList')) : []
    console.log(userAddressList)
    if (type === 'userAddressList') { // 1、返回地址数组
      return userAddressList
    } else if (type === 'userAddressSelected') { // 返回选中地址
      if (userAddressList.length === 0) {
        return {}
      }
      let copy = []
      userAddressList.forEach(function(item) { // 2、循环，找出选中地址
        if (item.select === true) {
          copy.push(item)
        }
      })
      return copy[0]
    } else if (/^(\d)*$/.test(type)) { // 3、选中数字
      return userAddressList[type]
    }
  }

  static modifyToLocalStorage(num, obj) { // 修改
    let userAddressList = wx.getStorageSync('userAddressList') ? JSON.parse(wx.getStorageSync('userAddressList')) : []
    userAddressList.splice(num, 1, obj)
    wx.setStorageSync('userAddressList', JSON.stringify(userAddressList))
    goBack()
  }

  static delToLocalStorage(num) { // 删除
    let userAddressList = wx.getStorageSync('userAddressList') ? JSON.parse(wx.getStorageSync('userAddressList')) : []
    for (let i = 0; i < userAddressList.length; i++) { // 删除选中项，默认上级选中
      if (i === num && i !== 0 && userAddressList[i].select === true) {
        userAddressList[i - 1].select = true
      }
    }
    userAddressList.splice(num, 1)
    wx.setStorageSync('userAddressList', JSON.stringify(userAddressList))
    goBack()
  }

  static selectedToLocalStorage(num) { // 选择地址
    let userAddressList = wx.getStorageSync('userAddressList') ? JSON.parse(wx.getStorageSync('userAddressList')) : []
    if (userAddressList.length === 0) {
      return
    }
    let temp = []
    userAddressList.forEach((item, index) => {
      item.select = false
      if (index === num) {
        item.select = true
      }
      temp.push(item)
    })
    wx.setStorageSync('userAddressList', JSON.stringify(userAddressList))
  }
}
