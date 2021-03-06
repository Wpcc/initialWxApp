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

### 生命周期

事情是这样，当前端发起请求后端返回一个用户权限码，这个码是存储在本地缓存还是直接存储在APP全局数据中。

如果存储在APP全局数据中，那么APP全局数据的生命周期是多少？

### 权限

#### 位置权限

当有些操作需要用户权限用户在最开始又拒绝的时候，通过`wx.openSetting`可以进行后续的权限引导。

示例：

通过DOM页面中map元素可以调用内部地图，其中`longitude`、`latitude`属性会定义map的中心位置，`markers`定义标点位置，`bindmarktap`绑定标点事件，`showLocation`会显示当前定位。

```html
<map longitude="{{longitude}}" latitude='{{latitude}}' markers="{{markers}}" show-location bindmarkertap="callout"></map>
```



比如，当用户打开小程序的时候，通过`wx.getLocation`获取用户地理位置，这个时候需要在app.json中定义位置权限弹窗。

```javascript
"permission":{
    "scope.userLocation":{"desc":"你的位置信息将用于小程序位置接口的效果展示"}
}
```

但是当用户拒绝APP获取权限的时候，小程序在后续操作就拿不到用户权限，这个时候通过`wx.openSetting`在后续点击过程中打开用户权限设置页面。

```javascript
Page({
    data:{
        getLocation: false //定义一个值，做判断
    },
    onShow: function() {
        const that = this
        wx.getLocation({
            success (res) {
                that.setData({
                    getLocation: true
                })
            } 
        })
    },
    openSetter: function () {
        if(!this.data.getLocation){
            wx.openSetting({
                success (res) {
                    console.log(res.authSetting)
                }
            })
        }else{
            console.log('你已经授权成功了')
        }
    }
})
```





### 简单案例（小程序）

**文件名：**

​	小程序基础案例

**文档目录：**

```shell
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
├─ pages # 视图层
│  ├─ index
│  │  ├─ index.js # js页面
│  │  ├─ index.json # 配置页面
|  |  ├─ index.wxml # html页面
│  │  └─ index.wxss # css页面
│  ├─ logs
│  │  ├─ logs.js
│  │  ├─ logs.json
│  │  ├─ logs.wxml
│  │  └─ logs.wxss
├─ utils
│  │  └─ util.js
├─ app.js # js应用主页面
├─ app.json # 主配置页面
├─ app.wxss # 全局css样式
└─ project.config.json # 工程配置项
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



#### 用户权限（js）

通过应用（APP）生命周期或者页面生命周期（page），可以通过js获取用户授权信息，在这之前一般需要检查用户的授权设置（即做了哪些授权），所以js授权设置一般会调用两个API。

`wx.getSetting`、`wx.getUserInfo`

 **wx.getSetting:**

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

**wx.getUserInfo:**

**该接口为异步接口，在有些情况下需要做相应处理，以免在页面加载完毕后才返回对应数据。**

对应参数：

| 属性            | 类型     | 默认值 | 必填 | 说明                                                         |
| --------------- | -------- | ------ | ---- | ------------------------------------------------------------ |
| withCredentials | boolean  |        | 否   | 是否带上登录态信息。当withCredentials为true时，要求此前有调用过wx.login且登录态尚未过期，此时返回的数据会包含encryptedData,iv等敏感信息；当withCredentials为false时，不要求有登录态，返回的数据不包含encryptedData,iv等敏感信息 |
| lang            | string   | en     | 否   | 显示用户信息的语言                                           |
| success         | function |        | 否   | 接口调用成功的回调函数                                       |
| fail            | function |        | 否   | 接口调用失败的回调函数                                       |
| complete        | function |        | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）             |

object.lang的合法值：

| 值    | 说明     |
| ----- | -------- |
| en    | 英文     |
| zh_CN | 简体中文 |
| zh_TW | 繁体中文 |

示例代码：

```java
//必须是在用户已经授权的情况下调用
wx.getUserInfo({
    success(res) {
        const userInfo = res.userInfo
        const nickName = userInfo.nickName
        const avatarUrl = userInfo.avatarUrl
        const gender = userInfo.gender //性别 0：未知 1：男 2：女
        const privince = userInfo.province
        const city = userInfo.city
        const country = userInfo.country
    }
})
```



#### 异步（getUserInfo）

`getUserInfo`为异步API，之所以需要解决该API出现的异步问题。是因为`getUserInfo`是在APP.js的生命周期（onLaunch）当中调用，并且调用的结果需要在index.js生命周期（onLoad）进行赋值。

通过回调函数可以解决以上问题：

在index.js定义全局回调函数`app.userInfoReadyCallback`，然后在app.js进行判断，如果`this.userInfoReadyCallback`存在的话，也就证明index.js中的onLoad已经加载，这个时候就可以将获取的值传递到回调函数中。

并在index.js进行数据的初始化。

#### 版本兼容（canIUse）

[具体说明](https://developers.weixin.qq.com/community/develop/doc/0000a26e1aca6012e896a517556c01)

示例代码：

```javascript
//在没有 open-type=getUserInfo 版本的兼容处理
wx.getUserInfo({
    success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
            userInfo: res.userInfo,
            hasUserInfo:true
        })
    }
})
```

示例代码说明：

之所以用以上代码，这是由于在低版本中`wx.getUserInfo`会直接弹出授权框。

#### 用户权限（wxml）

**button.open-type：**定义button按钮的权限类别。兼容性1.3.0，以及很低了。

>  open-type和bindgetuserinfo是绑定出现，其中open-type打开用户授权弹窗
>
> 如果用户否决授权，在下次点击依旧会有该授权弹窗
>
> bindgetuserinfo获取用户授权后的信息。



案例：

```html
<!-- html -->
<button open-type="getUserInfo" bindgetuserinfo="getUserInfo"> 获取头像昵称 </button>
```

```javascript
// open-type 绑定的设置函数 
getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
    })
}
```

如果还要做兼容，通过小程序自动生成的代码可查看具体兼容细节。

#### 权限区别

当给button按钮定义`open-type="getUserInfo"`属性，点击该按钮会弹出授权信息。该属性通常和`bindgetuserinfo="getUserInfo"`配合使用，通过`bindgetuserinfo`进行授权之后的操作。

而`wx.getUserInfo`会直接调用用户信息，并不出现弹窗（而且也不需要用户页面点击），如果用户未授权会直接进入到失败回调当中。故常与`getSetting`使用，从而减少bug出现。



### 数据设置

微信小程序中，将JS中的数据与页面中的数据分开，故通过`this.data`修改的数据只能在JS页面中有效，在wxml中并无效果。

所以小程序需要通过`this.setData`API来进行数据修改：

```javascript
Page({
    data:{
        text:'init data',
        num:0,
        array:[{text:'init data'}],
        object:{
            text:'init data'
        }
    },
    changeText() {
        this.setData({
            text:'change data'
        })
    },
    changeNum() {
        this.setData({
            num:2
        })
    },
    changeItemArray() {
        this.setData({
            'array[0].text':'changed data'
        })
    },
    changeItemObject() {
        this.setData({
            'object.text':'changed data'
        })
    },
    addNewField() {
        this.setData({
            'newField.text':'new data'
        })
    }
})
```

#### for

在小程序中并没有提供循环来对数据进行批量修改，故通过for循环可以达到以上效果：

```javascript
clickedPileNum: function (e) {
    // 通过数据模拟循环设置数据
    for(let i=0; i<this.data.pileNum.length; i++){
        var obj = {}
        var background = 'pileNum[' + i + '].background'
        var color = 'pileNum[' + i + '].color'
        obj[background] = '#ffffff' 
        obj[color] = '#23C675'
        this.setData(obj)
    }
    console.log(e._relatedInfo.anchorRelatedText) //获取点击按钮的值
}
```

### 样式设置

#### button边框

```css
button::after{
    border:none;
}
```

### 组件

特别注意地是组件中的根元素class必须设置为wrapper，否则不生效（在设置flex布局的时候，遇见的坑，当时设置container）。

### 全局配置

#### tabbar配置

```javascript
 "tabBar": {
    "color": "#333333",
    "selectedColor": "#23C675",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/images/menu_home_default.png",
        "selectedIconPath": "static/images/menu_home_clicked.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/images/menu_scan_default.png",
        "selectedIconPath": "static/images/menu_scan_clicked.png",
        "text": "扫一扫"
      },
      {
        "pagePath": "pages/mine/index",
        "iconPath": "static/images/menu_mine_default.png",
        "selectedIconPath": "static/images/menu_mine_clicked.png",
        "text": "我的"
      }
    ]
  }
```

### 支付功能

**第一步：小程序登录**

​	前端获取用户code传递给后端，后端获取code，通过`code2Session`接口换取用户唯一标识OpenID和会话密钥session_key。

流程图：

![](./readme/login.jpg)



**第二步：下单**

前端调用接口进行下单，后端通过该接口返回如下字段，其中数据包为必填选项，其余并必填选项。

```javascript
wx.requestPayment({
    'timeStamp':'', //当前时间戳
    'nonceStr':'', //随机字符串
    'package':'', //统一下单接口返回的prepay_id参数值，提交格式如：prepay_id=*
    'signType':'MD5', //签名类型，默认为MD5
    'paySign':'', //签名
    'success':function(res){},
    'fail':function(res){}
})
```

签名如下（需要提供appId，nonceStr，package，signType，timeStamp，key），其中key值为商户号中的设置的mch_id，具体如下：

```javascript
paySign = MD5(appId=wxd678efh567hg6787&nonceStr=5K8264ILTKCH16CQ2502SI8ZNMTM67VS&package=prepay_id=wx2017033010242291fcfe0db70013231072&signType=MD5&timeStamp=1490840662&key=qazwsxedcrfvtgbyhnujmikolp111111) = 22D9B4E54AB1950F51E0649E8810ACD6
```



微信小程序支付流程：

![支付流程](./readme/payment.jpg)



### 小程序码

[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/qr-code.html)

如果使用接口B进行开发，也就是后台通过scene进行传参。假如后台传过来的参数是`sn=10000013`，那么在小程序中通过onLoad生命周期中的option进行接收，接收如下：

```javascript
Page({
    onLoad(option){
        console.log(option.scene) // sn=10000013 等于号这里会转码
    }
})
```

测试方法：

- 调试阶段使用开发工具的条件编译自定义参数 scene = xxxx 进行模拟，开发工具模拟时的 scene 的参数值需要`encodeURIComponent`

```javascript
// 假设 scene = sn=10000013
Page({
    onLoad(option){
        console.log(option.scene) //由于等于号的关系，这里会直接打印sn
    }
})
```

- 使用微信工具中的通过二维码编译，加载后台生成的小程序二维码。

```javascript
// 假设 scene = sn=10000013
Page({
    onLoad(option){
        console.log(option.scene) //这里的等号会进行转码
    }
})
```















​	



