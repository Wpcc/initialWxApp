import {tip} from '../../../utils/tip' 
import {login} from '../../../utils/login'
import {goMine} from '../../../router/routes'
Component({
  properties:{
    tabsData:{
      type: Array,
      value: false
    }
  },
  methods:{
    goSkip(e){
      let url = e.currentTarget.dataset.item.jump_param
      let type = e.currentTarget.dataset.item.jump_type
      if(type === 2){ // 小程序跳转
        wx.navigateToMiniProgram({
          appId: 'wxb5d8d5874dcb2f3e',
          path: 'pages/index?session3rd=' + wx.getStorageSync('sesssion3rd'),
          envVersion: 'release',
          success(res) {
            // 打开成功
            console.log(res)
          }
        })
        return
      }
      // 如果跳转地址为空：证明未开发
      if(url){
        if(url === '../recharge/index'){
          wx.getSetting({
            success(res){
              if(res.authSetting['scope.userInfo']){
                console.log('sure')
                wx.navigateTo({
                  url: url
                })
              }else{
                wx.showToast({
                  title: '点击个人中心进行授权，才能进行该操作',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
          return
        }
        wx.navigateTo({
            url: url
        })
      } else{
        // 开发中，请等待
        wx.showToast({
          title: '开发中，请等待',
          icon: 'none',
          duration: 2000
        })
      }
    },
    bindGetUserInfo(e) { // 跳转主页：有登录逻辑
      tip.loading()
      login().then(res => {
        tip.loaded()
        if(res) {
          goMine()
        }
      })
    }
  }
})