## 说明文档

[官方文档](https://developers.weixin.qq.com/miniprogram/dev/)

### 配置文件

**小程序配置 app.json**

在微信小程序中配置文件为app.json，具体内容包括小程序的所有页面路径、界面表现、网络超时时间、底部tab等。

```javascript
{
    "page":["pages/index/index","pages/logs/logs"],
    "window":{
		"backgroundTextStyle":"light",
		"navigationBarBackgroundColor":"#fff",
		"navigationBarTitleText":"Wechat",
		"navigationBarTextStyle":"black"
	}
}
```

配置含义：
- pages字段：用于描述当前小程序所有页面路径，这是为了让微信客户端知道当前你的小程序页面定义在哪个目录。
- window字段：定义小程序所有页面的顶部背景颜色，文字颜色定义等。

**工具配置 project.config.json**

主要用来记录在工具上做的其他配置项。

**页面配置 page.json**

用来配置单个页面的一些属性，例如顶部颜色、是否允许下拉刷新等待。

### WXML 模板

类似于网页中的HTML，不同地是WXML提供自己的标签，该标签做了一定的封装，如`view`、`button`、`text`等，同样地WXML还提供地图、视频、音频等等组件能力。

### WXSS 样式

类似于CSS。

**不同地是WXSS提供新的尺寸单位rpx**，让开发者可以免去换算的烦恼，只要交给小程序底层来换算即可，由于采用的浮点数运算，所以运算结果会和预期结果有一点点偏差。

**WXSS还提供全局的样式和局部样式，**和前面的`app.js`，`page.json`的概念相同，你可以写一个`app.wxss`作为全局样式，会作用于当前小程序的所有页面，局部页面样式`page.wxss`仅对当前页面生效。

**注意WXSS仅支持部分css选择器。**

### JS 交互逻辑

类似于vue中的`JS`，负责和用户做交互：响应用户点击、获取用户位置等等。在小程序里面，通过编写`JS`脚步文件来处理用户的操作。

```html
<view>{{ msg }}</view>
<button bindtap="clickMe">点击我</button>
```

点击`button`按钮的时候，我们希望把界面上`msg`显示成`hello world`，于是我们在`button`上声明一个属性：`bindtap`，在JS文件里面声明了`clickMe`方法来响应这次点击操作：

```javascript
Page({
    clickMe(){
        this.setData({msg:'hello world'})
    }
})
```

### 简单案例（小程序）

**文档目录：**

```
├─ .idea
|  ├─ inspectionProfiles
|  |  └─ Project_Default.xml
│  ├─ octicons.eot
│  ├─ encodings.xml
│  ├─ misc.xml
│  ├─ modules.xml
│  ├─ workspace.xml
│  ├─ 小程序.iml
│  └─ repository-tree.js.map
├─ pages //视图层
│  ├─ index
│  │  ├─ index.js //js页面
│  │  ├─ index.json //配置页面
|  |  ├─ index.wxml //html页面
│  │  └─ index.wxss //css页面
│  ├─ logs
│  │  ├─ logs.js
│  │  ├─ logs.json
│  │  ├─ logs.wxml
│  │  └─ logs.wxss
├─ utils
│  │  └─ util.js
├─ app.js //js应用主页面
├─ app.json //主配置页面
├─ app.wxss //全局css样式
└─ project.config.json //工程配置项
```

**入口文件（app.json）：**

```json
{
    "pages":[ // 页面文件路径
        "pages/index/index",
        "pages/logs/logs"
    ],
    "windows":{ // 定义小程序所有页面的顶部背景颜色、文字颜色
        "backgroundTextStyle":"light", // 下拉loading样式
        "navigationBarBackgroundColor":'#fff', // 导航栏背景色
        "navigationBarTitleText":"WeChat", // 导航栏名字
        "navigationBarTextStyle":"black" // 导航栏文字颜色
    }
}
```

**全局样式文件（app.wxss）：**

```css
.container{
    height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:space-between;
    padding:200px 0;
    box-sizing:border-box;
}
```

**全局js文件（app.js）:**

```javascript
App({
	//应用初始化
    onLaunch: function () {
        //获取本地存储中logs的值（该值为数组），将日期加入到数组头部
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    }
    //登录
    wx.login({
        success: res => {
            //发送 res.code 到后台换取 openId, sessionKey, unionId
        }
    })
    //获取用户授权状态
    wx.getSetting({
        success: res => {
            if(res.authSetting['scope.userInfo']){
                //已经授权，则直接调用getUserInfo获取头像昵称，不会弹窗
                wx.getUserInfo({
                    success:res => {
                        //可以将 res 发送给后台解码出 unionId
                        this.globalData.userInfo = res.userInfo
                        //由于 getUserInfo 是网络请求，可能会在 Page.onload 之后返回
                        //所以此处加入 callback 以防止这种情况
                        if(this.userInfoReadyCallback){
                            this.userInfoReadyCallback(res)
                        }
                    }
                })
            }
        }
    }),
    globalData:{
        userInfo:null 
    }
})
```

解惑：

 `wx.getSetting`:

获取用户授权设置（同意授权、拒绝授权），返回值中只会出现小程序已经向用户请求过的权限。

| 属性                          | 类型     | 默认值 | 必填 | 说明                   |
| ----------------------------- | -------- | ------ | ---- | ---------------------- |
| success（同意授权的回调函数） | function |        | 否   | 接口调用成功的回调函数 |
| fail（拒绝授权的回调函数）    | function |        | 否   | 接口调用失败的回调函数 |
| complete（完成的回调函数）    | function |        | 否   | 接口调用结束的回调函数 |

示例代码：

```javascript
wx.getSetting({
    success(res){
        console.log(res.authSetting)
        //res.authSetting的值为一个对象，记录用户不同的授权信息，返回值为Boolean
        // res.authSetting = {
        //     "scope.userInfo":true,
        //     "scope.userLocation":true
        // }
    }
})
```

解惑：

`this.userInfoReadyCallback`:







​	



