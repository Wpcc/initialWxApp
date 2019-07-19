// pages/components/navigation/index.js
import {goIndex,goBack} from '../../../router/routes'
const App = getApp()
Component({
  methods:{
    goIndex,
    goBack
  },
  data:{
    navH:1
  },
  lifetimes:{
    attached:function(){
      this.setData({
        navH:App.globalData.navHeight
      })
    }
  }
})