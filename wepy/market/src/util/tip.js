/**
 * 提示与加载工具类
 */
export default class tip {
  constructor() {
    this.isLoading = false
  }
  /**
   * 弹出提示框
   */

  static success(title, duration = 500) {
    setTimeout(() => {
      wx.showToast({
        title: title,
        icon: 'success',
        mask: true,
        duration: duration
      })
    }, 300)
    if (duration > 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, duration)
      })
    }
  }

  /**
   * 弹出确认窗口
   */
  static confirm(text, payload = {}, title = '提示') {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: text,
        showCancel: true,
        success: res => {
          if (res.confirm) {
            resolve(1)
          } else if (res.cancel) {
            resolve(0)
          }
        },
        fail: res => {
          reject(payload)
        }
      })
    })
  }

  static toast(title, onHide, icon = 'success') {
    setTimeout(() => {
      wx.showToast({
        title: title,
        icon: icon,
        mask: true,
        duration: 500
      })
    }, 300)

    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide()
      }, 500)
    }
  }

  /**
   * 警告框
   */
  static alert(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
      duration: 1500
    })
  }

  /**
   * 错误框
   */

  static error(title, onHide) {
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
      duration: 1500
    })
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide()
      }, 500)
    }
  }

  static errorSync(title, duration = 1500, methods) {
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
      duration: duration
    })
    if (duration > 0) {
      setTimeout(() => {
        methods()
      }, duration)
    }
  }

  /**
   * 弹出加载提示
   */
  static loading(title = '加载中') {
    if (tip.isLoading) {
      return
    }
    tip.isLoading = true
    wx.showLoading({
      title: title,
      mask: true
    })
  }

  /**
   * 加载完毕
   */
  static loaded() {
    if (tip.isLoading) {
      tip.isLoading = false
      wx.hideLoading()
    }
  }

  static share(title, url) {
    return {
      title: title,
      path: url,
      imageUrl: '../../static/images/share.png',
      success: function(res) {
        tip.toast('分享成功')
      }
    }
  }
}

/**
 * 静态变量，是否加载中
 */
tip.isLoading = false

module.exports = tip
