## 项目说明

### 产品目录

```shell
├── api
|	└── request.js // 封装promise请求，并做简单拦截
├── modules // 第三方库
|	└── md5.js // md5加密，用于支付流程
├── pages
├── router
|	└── routes.js // 路由跳转
├── static // 静态文件
├── utils // 业务逻辑
```

### 全局变量定义

```javascript
globalData:{
    url:'https://backend.quanjieshop.com', //promise封装调用
    appId:'wx663da65452ee2d87', //appId也抽取出来
    listInput:'', //主页输入框和列表页搜索框文字显示
    //用户坐标
    longitude:114.207034 
    latitude:30.550434 
}
```



### 图标风格

#### 底部图标

采用菜鸟官方图标库，图标大小为16网格。默认图标/字体颜色为#333333，选中图标/字体颜色为#23C675。

#### iconbar

icon图标选择：多色图标库-智能城市

布局：flex

引用地址：本地

### 组件库选择

[weui-wxss](https://github.com/Tencent/weui-wxss)

### 主页

#### 搜索框

**基本样式：**

搜索框高度34px，当给元素设置为inline-block时，需要使用`vertical-align:top`才能进行垂直居中对齐，原因应该是Inline-block的对齐方式和images类似，从而导致使用`vertical-align:middle`会出现向下移动的偏差。

**输入框获取焦点和失去焦点高度出现偏差？**

和`vertical-align`无关，查看文档，据说是微信小程序固有的bug，解决方式，将input框调小，从而让移动偏差缩小。

解决办法：用`placeholder`做展示，通过`disabled:true`禁用输入框焦点，并将搜索信息导入到列表页面。

**输入框文字过多，省略：**

#### map

使用calc进行自适应布局。

样式：

充电桩可用图标颜色（蓝色）#3385ff，充电桩不可用颜色（红色）#ff0000

#### tabbar

微信小程序并没有提供底部菜单栏绑定事件。故此处实现使用`view`进行底部菜单栏的模拟。

### 列表页

#### 搜索框

**基本样式：**

样式和主页搜索框样式一致。

#### 输入校验



#### 详情列表

### 个人中心

游客并不需要和后台产生交互，所以这里并不需要通过`wx.getUserInfo`对用户信息进行拉取。通过`<opent-data>`组件仅做展示即可。

```html
<!-- 如果只是展示用户头像昵称，可以使用<open-data/>组件 -->
<open-data type="userAvatarUrl"></open-data>
<open-data type="userNickName"></open-data>
```

### 支付页

**支付按钮做延迟，否则用户会一直点击提交。这个地方做节流**

**所有涉及到用户登录态请求的地方，都要考虑登录态是否过期（当用户用两台设备的时候，特别容易发生该事件，原因在于登录态保存在本地缓存中），顾当登录态过期，后台返回状态码0的时候，重新登录重置本地缓存。**

## 逻辑说明

### 权限

#### 详情页

用户详情页中的我要充电按钮获取用户权限，通过`wx.getSetting`判断用户是否授权。

```javascript
wx.getSetting({
    success (res){
        if(res.authSetting['scope.userInfo']){
        //如果授权
        	//通过localstorage判断是否第一次授权
        	if(!wx.getStorageSync('userId')){
                //第一次授权，与后台交互
        	}else{
                //不是第一次授权，直接进行支付操作
        	}
        }else{
        //如果未授权    
        }
    }
})
```

### 登录页

点击登录按钮获取用户权限，包括头像、名字、位置信息。如果用户没有开通GPS，**做相对于处理，弹窗提示用处开通GPS？**



### **首页**

#### map

以用户坐标轴为中心，显示附近充电桩位置。在地图上可添加扫码图标，点击调取微信扫码功能，扫码成功进入支付详情页。

其次，点击附件充电桩图标，充电桩图标放大，底部出现充电桩位置详情页面，点击跳转到微信内置导航，显示用户位置和当前充电桩位置，底部出现导航地图选择，包括（腾讯，百度，等）

**中心点坐标误差：**

当使用`wx.getLocation`获取用户当前的地理位置，并将该地理位置赋值给中心点（longitude，latitude）的时候，中心点位置和用户当前位置存在巨大的偏移误差。

代码如下：

```javascript
onShow:function () {
    const that = this
    wx.getLocation({
        type:'wgs84',
        success (res) {
            that.setData({
                getLocation:true,
                latitude:res.latitude,
                longitude:res.longitude
            })
        }
    })
}
//wgs84返回的是gps坐标，gcj02返回的是火星坐标可用于wx.openLocation的坐标
```

将wgs84调整成gcj02便能减少中心点与用户当前位置的偏差。

**获取marker点的ID**

```javascript
callout: function(e) { //markers绑定函数
    console.log('clicked marker')
    console.log(e.markerId)
}
```

**覆盖在map组件上的弹出框：**

API:

​	controls(控件，即将废除，建议使用cover-view代替)，需要注意地是cover-view需要在需要覆盖的组件（如：map）之上。



#### 输入框

这个逻辑处理比较麻烦，点击搜索框进入到列表页面，列表页面通过`localstorage`存储用户搜索记录，同时显示附近的充电桩，如果为详细的充电桩，则跳转到支付详情页。如果为详细地址，则回跳到主页，并改变map中的数据。

#### 我要充电

跳转地址和搜索框地址一样，跳转到list页面。

### 详情页

输入框点击完成或搜索按钮------》跳转到首页，并将输入框内容以url参数的形势传值回首页。



### 支付页

用户点击微信支付，通过`wx.getStorageSync`同步获取用户的`userId`，通过用户`userId`判断用户是否在后台进行注册，如果存在`userId`也就是用户注册过，那么直接进行支付逻辑。如果不存在`userId`也就是用户没有注册，那么获取用户的信息权限。

信息权限：



### 兼容

#### 权限兼容

**用户地理位置：**



### 改变样式

具体逻辑：通过回调函数返回事件名中的id获取页面中的DOM节点，与页面中DOM节点ID进行对比，并通过改变页面中的三元操作符来进行样式修改。

```html
<!-- html页面 -->
<view id="tabbar-underway" class="tabbar-underway" style="{{leftSelected==true ? 'border-bottom:2px solid #23C675' : ''}}" bindtap="changeStyle">
	<text class="underway-text">进行中</text>
</view>
```

```javascript
// js页面
 data: {
    leftSelected: true, // 配合html三元运算符控制左边选中样式
    rightSelected: false, // 右边选中样式
  },
  // 改变样式逻辑
  changeStyle: function (e) {
    if(e.currentTarget.id == 'tabbar-underway'){
      this.setData({
        leftSelected: true,
        rightSelected: false
      })
    }
    else if(e.currentTarget.id == 'tabbar-completed'){
      this.setData({
        leftSelected: false,
        rightSelected: true
      })
    }
  }
```

具体可查看[官方事件文档](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)

一个颇为麻烦的改变样式方式：

```javascript
 data: {
    pileNum:[
      { id: 0, content: '0', background: '#ffffff', color: '#23C675' },
      { id: 1, content: '1', background: '#ffffff', color: '#23C675' },
      { id: 2, content: '2', background: '#ffffff', color: '#23C675' },
      { id: 3, content: '3', background: '#ffffff', color: '#23C675' },
      { id: 4, content: '4', background: '#ffffff', color: '#23C675' },
      { id: 5, content: '5', background: '#ffffff', color: '#23C675' },
      { id: 6, content: '6', background: '#ffffff', color: '#23C675' },
      { id: 7, content: '7', background: '#ffffff', color: '#23C675' },
      { id: 8, content: '8', background: '#ffffff', color: '#23C675' },
      { id: 9, content: '9', background: '#ffffff', color: '#23C675' }
    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
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
    var obj = {}
    var background = 'pileNum[' + e._relatedInfo.anchorRelatedText + ']background'
    var color = 'pileNum[' + e._relatedInfo.anchorRelatedText + '].color'
    obj[background] = '#23C675'
    obj[color] = '#ffffff'
    this.setData(obj)
    console.log(e._relatedInfo.anchorRelatedText) //获取点击按钮的值
  }
```

**由于小程序原生更改数据需要调用`this.setData`方法，该方法颇为麻烦，特别需要批量更改数组中的数据，则必须进行key值的字符串拼接。**



