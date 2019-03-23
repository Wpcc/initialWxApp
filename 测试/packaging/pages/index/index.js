//index.js
//获取应用实例
const app = getApp()
import {setDataArr} from '../../utils/setDataArr'

Page({
  data: {
    num:[{a:1},{a:2}]
  },
  changeArr:function () {
    setDataArr(this.data.num,{a:3})
    console.log(this.data.num.a)
  }
 
})
