// pages/components/navigation/index.js
import {goSocket,goBack} from '../../../utils/routes'
const App = getApp()
Component({
  methods:{
    goSocket,
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