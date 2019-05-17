## 开发文档

### 地址逻辑

将用户地址存入到`localstorage`中的`userAddressList`数组中。

- 通过判断是否存在`userAddressList`确定显示是：新增收货地址还是直接读取显示地址
- 如果是新增收货地址，点击跳转到新增收货地址页面。如果是直接读取显示地址，则跳转到编辑地址页面。

```javascript
userAddressList:[
    {
        select:true // 是否显示,默认为false
        name:'', // 姓名
        phone:'', // 电话号码
        area:'', // 城市选择
        address:'' // 详细地址
    }
]
```

**API：**

```javascript
// 需要注意value的值必须为字符串
wx.getStorageSync('key'） // 获取本地存储
wx.setStorageSync('key','value') // 设置本地缓存
wx.removeStorageSync('key') // 删除选中缓存
```

**操作步骤：**

- 添加：
  - 将获取对象userAddress的值push到userAddressList当中
  - 将userAddressList数组数据转化为字符串，并存入到`localStorage`中
- 删除：
  - 将`localStorage`中的数据拿出来转化为数组，
  - 删除数组中对应项后，将数组转化为字符串，存入到`localStorage`中