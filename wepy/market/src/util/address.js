import {goBack} from '../router/routes'
import {request} from './request'
export default class Address {
  static addToServer(data) { // 添加地址到本地存储
    request('POST', '/api/Address/edit', {
      header: {
        session3rd: wx.getStorageSync('session3rd')
      },
      data: {
        username: data.name,
        phone: data.phone,
        province: data.provinceName,
        city: data.cityName,
        area: data.countryName,
        address: data.address,
        id: data.id
      }
    })
    .then(res => {
      if (res.status === 1) {
        goBack()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

  static getAddressFromServer() { // 是返回选中地址对象还是所有数组
    return new Promise((resolve) => {
      request('GET', '/api/Address/lst', {
        header: {
          'session3rd': wx.getStorageSync('session3rd')
        }
      })
      .then(res => {
        resolve(res.data)
      })
    })
  }

  static delToServer(id) { // 删除
    request('POST', '/api/Address/del', {
      header: {
        session3rd: wx.getStorageSync('session3rd')
      },
      data: {
        id: id
      }
    })
    goBack()
  }
}
