## 项目说明

### 图标风格

#### 底部图标

采用菜鸟官方图标库，图标大小为16网格。默认图标/字体颜色为#333333，选中图标/字体颜色为#3385ff。

#### iconbar

icon图标选择：多色图标库-智能城市

布局：flex

引用地址：本地

### 组件库选择

[weui-wxss](https://github.com/Tencent/weui-wxss)

### 登录页



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

### 列表页

#### 搜索框

**基本样式：**

样式和主页搜索框样式一致。

#### 历史记录

#### 详情列表



## 逻辑说明

### 权限

用户进入首页，获取用户地理位置，弹出权限框。

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



## 接口

map接口，使用gcj02国测局坐标系：

```javascript
// response 返回值
{
    code:2000,
    markers:[
        {
            latitude:30.593099, //number 维度
            longitude:114.305393, //number 经度
            name:"良品铺子店", //string 名字
            address:"武汉市汉阳区汉阳大道知音西村2号1-2", //string 地点
            pileNumber:00000001, //number 充电桩号
            use:false, //boolean 充电桩能否使用
            distance：200, //number 距离
        }
    ]
}
```





