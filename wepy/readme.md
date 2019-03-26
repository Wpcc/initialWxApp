## wepy文档

[官方文档](https://tencent.github.io/wepy/document.html#/?id=%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97)

### wepy安装和创建

**全局安装或更新wepy命令行工具**

```bash
npm install wepy-cli -g
```

**在开发目录中生成Demo开发项目，1.7.0之后版本请移步wepy-cli文档**

```shell
wepy new myproject
#1.7.0之后版本使用 wepy init standard myproject 初始化项目，使用 wepy list 查看项目模板
```

**切换至项目目录**

```shell
cd myproject
```

**安装依赖**

```shell
npm install
```

**开启实时编译**

```shell
wepy build --watch
```

### wepy项目的目录结构

```shell
├── dist                   小程序运行代码目录（该目录由WePY的build指令自动编译生成，请不要直接修改该目录下的文件）
├── node_modules           
├── src                    代码编写的目录（该目录为使用WePY后的开发目录）
|   ├── components         WePY组件目录（组件不属于完整页面，仅供完整页面或其他组件引用）
|   |   ├── com_a.wpy      可复用的WePY组件a
|   |   └── com_b.wpy      可复用的WePY组件b
|   ├── pages              WePY页面目录（属于完整页面）
|   |   ├── index.wpy      index页面（经build后，会在dist目录下的pages目录生成index.js、index.json、index.wxml和index.wxss文件）
|   |   └── other.wpy      other页面（经build后，会在dist目录下的pages目录生成other.js、other.json、other.wxml和other.wxss文件）
|   └── app.wpy            小程序配置项（全局数据、样式、声明钩子等；经build后，会在dist目录下生成app.js、app.json和app.wxss文件）
└── package.json           项目的package配置
```

### 初步查看wepy生成模板

**命令行创建wepy模板：**

```shell
# 创建wepy模板
wepy init standard myproject
# 进入到项目目录
cd myproject
# 安装依赖文件
npm install
# 开启实时编译
wepy build --watch
```

**模板目录结构：**

```shell
├── dist  # wepy框架编译后目录
├── node_modules # 第三方安装包目录
├── src # 页面目录
├── .editorconfig # 编译器配置：用处不大
├── .eslintignore # eslint语法检测忽略项配置：有点用处
├── .eslintrc.js # eslint语法检测配置：有点用处
├── .gitignore # git忽略项配置：初始化已配置好
├── .prettierrc # 不知道什么玩意
├── .wepyignore # wepy忽略项？
├── package-lock.json # package详情，给编译器看的
├── package.json # package详情，给人看的
├── project.config.json # 微信配置项，默认已配置好
├── wepy.config.js # wepy配置项

```

**入口文件app.wpy：**

```vue
<script>
import wepy from 'wepy' // 引入wepy类
import 'wepy-async-function' // 引入promise类

export default class extends wepy.app {
  config = {  // json 配置
    pages: [ // 页面配置
      'pages/index'
    ],
    window: { // window类
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  globalData = { // 全局变量
    userInfo: null
  }

  constructor () { // 构造函数：ES6语法
    super() // 继承
    this.use('requestfix') // 修复原生小程序请求并发
    this.use('promisify') // 请求promise化
  }

  onLaunch() { // 生命周期：当APP初次加载时触发
    this.testAsync()
  }

  sleep (s) { // 全局函数
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('promise resolved')
      }, s * 1000)
    })
  }

  async testAsync () { // es7 异步函数
    const data = await this.sleep(3)
    console.log(data)
  }

  getUserInfo(cb) { // 微信提供获取用户信息API
    const that = this
    if (this.globalData.userInfo) {  //如果全局userInfo存在
      return this.globalData.userInfo // return 全局userInfo
    }
    wepy.getUserInfo({ // 否则，获取userInfo，并且将userInfo赋值给全局中的userInfo
      success (res) {
        that.globalData.userInfo = res.userInfo
        cb && cb(res.userInfo) // 调用回调：如果回调存在，传入res.userInfo并启动
      }
    })
  }
}
</script>

<style lang="less">
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
</style>
```

### 主文件index.wpy

#### getUserInfo

```javascript
// app.wpy 获取用户信息 
getUserInfo(cb) { // 微信提供获取用户信息API
    const that = this
    if (this.globalData.userInfo) {  //如果全局userInfo存在
      return this.globalData.userInfo // return 全局userInfo
    }
    wepy.getUserInfo({ // 否则，获取userInfo，并且将userInfo赋值给全局中的userInfo
      success (res) {
        that.globalData.userInfo = res.userInfo
        cb && cb(res.userInfo) // 调用回调：如果回调存在，传入res.userInfo并启动
      }
    })
}
// index.wpy
this.$parent.getUserInfo(function (userInfo) { 
    if (userInfo) {
        self.userInfo = userInfo // 修改主页面userInfo
    }
    self.normalTitle = '标题已被修改'

    self.setTimeoutTitle = '标题三秒后会被修改'
    setTimeout(() => {
        self.setTimeoutTitle = '到三秒了'
        self.$apply() // getUserInfo为异步函数，顾需要使用$apply进行脏数据检测
    }, 3000)

    self.$apply()
})
```

**基本逻辑：**

如果全局userInfo存在，那么通过return语句中断程序后续执行。如果全局userInfo不存在的话，通过`wepy.getUserInfo`获取用户信息，**特别注意地是getUserInfo这个API已经更改**，故此刻通过`getUserInfo`获取用户信息是没有授权弹窗，直接进入fail回调失败，也就没有后续操作。

**API详情：**

微信在获取用户信息这块api做了修改，以前是以`wx.getUserInfo`为主，现在是以`open-type="getUserInfo" bindgetuserinfo="getUserInfo"`为主，两者区别详情请查看微信官方API。

**页面修改：**

删除app.wpy中getUserInfo方法，删除index.wpy中this.$parent.getUserInfo调用方法，在index.wpy中的template中添加如下内容：

```vue
<view class="userinfo"> <!-- handleViewTap 事件删除 -->
      <image class="userinfo-avatar" src="{{ userInfo.avatarUrl }}" background-size="cover"/>
      <view class="userinfo-nickname">{{ userInfo.nickName }}</view>
      <button open-type="getUserInfo" bindgetuserinfo="bindGetUserInfo">获取头像昵称</button> <!-- 添加内容 -->
    </view>
```

在index.wpy中js的方法中添加如下方法：

```javascript
bindGetUserInfo (e) {
    console.log(e.detail) // 会打印触发事件后携带内容
    this.userInfo = e.detail.userInfo
    this.normalTitle = '标题已被修改'
    
    this.setTimeoutTitle = '标题三秒后会被修改'
    setTimeout(() => {
        this.setTimeoutTitle = '到三秒了'
        this.$apply()
    }, 3000)
}
```

**这个时候，当我们点击获取头像昵称按钮的时候，页面便会自动显示昵称按钮，同时在下一行中的测试数据绑定中的数据也会相应发生变化。**

**进一步修改：**

在微信开发者工具中，当点击编译后，页面中获取的用户信息随之消失。这是因为，虽然此刻已经将获取到用户信息存储到缓存当中，但页面并没有做相对应赋值，只有在触发按钮的时候，才会通过事件进行赋值，那么在onload加入以下内容：

```javascript
async onLoad() {
    const res = await wepy.getSetting()
    if(res.authSetting['scope.userInfo']) {
        const info = await wepy.getUserInfo()
        this.userInfo = info.userInfo
    }
    this.$apply()
}
```

此处使用了ES7中的`await/async`语法，将onload设置为异步，res同步获取到`wepy.getSetting()`成功之后的返回值，判断返回值中`res.authSetting['scope.usnerInfo']`是否存在，如果存在获取`wepy.getUserInfo()`的返回值，并赋值给页面数据`this.userInfo`，由于wepy数据赋值采用的是脏数据检测，故异步需要手动加`this.$apply`才能赋值成功。

**这个时候，当页面加载的时候便会显示用户图像和昵称。**但是，下面绑定的数据并不会修改，这是因为在onLoad生命周期中，并没有添加以下代码：

```javascript
this.normalTitle = '标题已被修改'
    
this.setTimeoutTitle = '标题三秒后会被修改'
setTimeout(() => {
    this.setTimeoutTitle = '到三秒了'
    this.$apply()
}, 3000)
```

这些代码，在bindGetUserInfo中已经出现过，任何已经出现过的东西都应该做封装，这里有个坑，**自定义事件应该和methods平级，而不是定义在methods中**：

```javascript
changeInfo(userInfo){
    if(userInfo){
        this.normalTitle = '标题已被修改'
        this.setTimeoutTitle = '标题三秒后会被修改'
        setTimeout(() => {
          this.setTimeoutTitle = '到三秒了'
          this.$apply()
        }, 3000)
    }
}
// 修改bindGetUserInfo
bindGetUserInfo(e,changeInfo){
    this.userInfo = e.detail.userInfo
    changeInfo && changeInfo(this.userInfo)
}
// 修改onLoad
```

**知识点：**

- 获取用户API变动
- ES7中await和async使用
- wepy框架中脏数据实现，[官方文档](https://tencent.github.io/wepy/document.html#/?id=wepy%E8%84%8F%E6%95%B0%E6%8D%AE%E6%A3%80%E6%9F%A5%E6%B5%81%E7%A8%8B)

#### 修改数据

**先看一下template代码：**

```vue
<!-- 2.修改数据 -->
    <panel>
      <view class="title" slot="title">测试数据绑定</view>

      <text class="info">{{normalTitle}}</text> <!-- 这部分为getUserInfo中的内容-->
      <text class="info">{{setTimeoutTitle}}</text><!-- 这部分为getUserInfo中的内容-->
        
      <text class="info">{{mixin}}</text>
      <text class="info">{{mynum}}</text>
      <text class="info">{{now}}</text>
      <button @tap="plus('a')" size="mini">  +  </button>
    </panel>
```

**js中的代码：**

```javascript
export default class Index extends wepy.page {
    data = {
        mynum:20
    }

    computed = {
		now () {
            return +new Date() // 用了一下套路，将new Date（）转换成时间戳
		}
    }

    methods = {
        plus () { 
            this.mynum++
        }
    }
}
```

**修改(可以看到在template中调用方法时有传参，而js中并没有定义参数)：**

```javascript
methods = {
    plus (a) {
        this.mynum++
        console.log(a)
    }
}
```

**mixin：**

外部js页面：

```js
import wepy from 'wepy'

export default class testMixin extends wepy.mixin {
  data = {
    mixin: 'This is mixin data.'
  }
  methods = {
    tap () {
      this.mixin = 'mixin data was changed'
      console.log('mixin method tap')
    }
  }

  onShow() {
    console.log('mixin onShow')
  }

  onLoad() {
    console.log('mixin onLoad')
  }
}
```

index.wpy引入mixin:

```vue
<template>
	<text class="info">{{mixin}}</text>
</template>
<script>
    import testMinxin from '../mixins/test'
    export default class Index extends wepy.page {
        mixins = [testMinxin]
    }	
</script>
```



**知识点：**

- wepy框架中computed计算属性，小技巧`+new Date()`将UTC类型的日期格式转换成时间戳

- wepy框架中的事件传参，[官方文档](https://tencent.github.io/wepy/document.html#/?id=_2-%E4%BC%98%E5%8C%96%E4%BA%8B%E4%BB%B6%E5%8F%82%E6%95%B0%E4%BC%A0%E9%80%92)

- mixin，类似于js中的原型，定义的属性和方法可以在引入中使用，如果页面中定义相同的属性和方法，则覆盖，[官方文档](https://tencent.github.io/wepy/document.html#/?id=mixin-%E6%B7%B7%E5%90%88)

  