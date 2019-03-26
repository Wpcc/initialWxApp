## 充电桩重构文档

### wepy初始化

**创建空模板：**

```shell
wepy init empty standrad 充电桩重构
```

**切换目录：**

```shell
cd 充电桩重构
```

**安装依赖：**

```shell
npm install
```

**开启实时编译**

```shell
wepy build --watch
```

### 添加基本构建

**创建逻辑目录(src目录下)：**

```shell
├── api # request请求
├── components # 组件
├── pages # 视图
├── router # 路由
├── static # 静态资源
├── utils # 基本逻辑
├── app.wpy # 入口文件
```

**app.wpy支持promise：**

```shell
# 工程所在目录命令行
npm install wepy-async-function
```

**app.wpy引入**

```javascript
import 'wepy-async-function'

export default class extends wepy.app {
    constructor () {
        super()
        this.use('requestfix') //修复原生小程序请求并发
        this.use('promisify') // 请求promise化
    }
}
```

