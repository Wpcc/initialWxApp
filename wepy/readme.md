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

```

**主文件index.wpy：**

修改部分：微信在获取用户信息这块api做了修改，以前是以`wx.getUserInfo`为主，现在是以`open-type="getUserInfo" bindgetuserinfo="getUserInfo"`为主，两者区别详情请查看微信API。

