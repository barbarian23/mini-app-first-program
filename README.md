# uni-business-card

## 项目配置
```
npm install
npm i yarn -g &&  yarn install
```

### 启动命令
```
npm run dev:mp-weixin
npm run dev:h5
```

### build命令
```
npm run build:mp-weixin
npm run build:h5
```

### uni-app官方文档
```
https://uniapp.dcloud.io/
```

### 坑点一:
```
  注意打包时候，app.json是否打包完整，一定要仔细检查app.json中的 permission、navigateToMiniProgramAppIdList 等字段是否存在。
  crm端每次打包也要注意这个坑，如果没有这两个字段就手动加上去
```

### 坑点二:
```
  如果socket要增加某些字段、后台给你穿了、控制板ws里面也有、那你就要去util文件夹下的websocket.js 里面发送消息和接受消息那个地方改一下
```

### 小程序上传的问题
```
  需要手动build后在小程序开发工具中打开build出的文件夹再上传，上传时要把ext.json从打包目录中移除
  如果确定ext,json没有打包中小程序中，那么从草稿箱重新走一遍流程
  草稿箱中的小程序就相当于一个模版，这个时候是没有ext.json的信息，到提交的时候，才会根据不同的oem客户查询company表，
  找到company_key，然后提交到对应小程序后台的，这个时候小程序包就会包含ext.json文件了，熟悉微信的这个机制
