# vue2_chat(聊天室)

## 前言

2022年的暑假格外炎热，让本来行情不好的前端火上浇油了，最近也试着去求职，这么热的天是真的受不了。最近在github上面看到别人做的聊天室系列的项目，让我十分感兴趣，同时我也想做个完整的项目来充实自己，巩固自己所学的，所以就想着使用Vue.js、Node.js、socket.io来做一个聊天室。

一开始的想法是用websocket的，思来想去，后端还是使用看socket.io，前端的就使用了vue-socket.io和socket.io-client，因为也是初次使用这个包的，开发过程中难免出现了很多奇奇怪怪的报错，浏览了官方的文档也没有详细的说明，只能一遍遍的去试去了解，也在这个过程中不断的进步，在选择vue的版本的时候也还在思索着是否使用vue3.x的版本，考虑到项目里面的一些模块使用vue2.x的熟悉一点抛去了使用vue3.x的想法了，目前终于完成了聊天室的内容，分享出来，如有错误，请多指教。

## 说明

1. 本前端项目地址：[github地址](https://github.com/Look-at-another-firework/vue2_chat)，[gitee地址](https://gitee.com/the_betterest/vue2_chat)
2. 本项目的后端项目：[github地址](https://github.com/Look-at-another-firework/vue2_chat_server)，[gitee地址](https://gitee.com/the_betterest/vue2_chat_server)
3. 前端设计是本人事先规划的，色调的选取使用了我喜欢的蓝色调，减少点视觉疲劳，画面方面采用后台管理的风格，一目了然。
4. 本人目前正在求职，后面的时间可能没有那么的自由，但会不定期的更新完善该项目，如有问题请直接在 Issues 中提。
5. 如果觉得该项目帮助到你了，可以点点star支持一些，本人的一些笔记发布在[csdn](https://blog.csdn.net/The_more_more)和我自的博客网站

## 项目简介

1. 本项目前后端分离，前端基于`Vue`+`Vue-router`+`Element-ui`+`Axios`+`vue-socket.io`+`socket.io-client`。
2. 后端基于`Node.js(express框架)`+`socket.io`实现。
3. 前端页面主要为登录界面、首页、设置、帮助，重点在于聊天的显示界面
4. 实现了登录token校验，因为本项目未涉及数据库所以保存的方法为本地和服务器的socket.io的短期储存，多人聊天画面

## 技术栈

- **前端：**`Vue`+`Vue-router`+`Element-ui`+`Axios`+`vue-socket.io`+`socket.io-client`

- **后端：**`Node.js`+`express`+`socket.io`

## 模块介绍

### 登录

登录界面的设计参考了后台管理的风格，以同色调的图片作为背景，中间区域为名称密码输入区域，看起来更加的简洁美观，收集好用户的信息调用接口获取token，同时将用户的信息在后端的socket.io保存好，用于校验是否会二次登录，验证通过即可跳转页面

### 首页

在首页反面，也是使用了elementUI的` Container 布局容器`来实现，左侧方便显示个人信息、操作，右侧就可以成为我们的聊天界面

### 设置

设置界面主要为我们的名称和密码，个性签名做一个修改，因为没有涉及到数据库的操作，只能修改我们看到后的，可能在以后的某一天，项目的迭代完成了这个功能，其次本有着头像修改的功能，也是期盼着在后续的完善了。

## 运行项目

1. 下载或者clone好前端项目和后端项目
2. 使用`npm i `下载好相关的包，如果出现了报错，可能是因为node的版本不对，使用`node -v`查看自己的node版本，我的是：`v12.22.12`，因为需要兼容一些包，所以我的node版本不是很高，可以自行降低版本。
3. 使用`node aqq.js`把我们后台项目启动，注意好目录。
4. 使用`npm run serve`将前端项目跑起来即可。

## 主要页面截图

- 登录

![登录](./images/登录.jpg)

- 首页

![首页](./images/首页.jpg)