// 引入区域
const express = require('express')
const app = express()
const server = require('http').Server(app)
// const cors = require('cors')
const io = require('socket.io')(server, { cors: true })
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Accept,Content-type')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  if (req.method.toLowerCase() == 'options') res.sendStatus(200)
  else next()
})
// app.use(cors)
// 导入相关的包
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')

// 下列四行代码为解析body的
// 解析post表单数据的中间件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
// 解析 application/json
app.use(express.json())
// 解析 application/x-www-form-urlencoded
app.use(express.urlencoded())
// end

// 定义一个字符串作为密钥
const secretKey = 'Helloworld'
app.use(expressJWT({ secret: secretKey }).unless({ path: [/\/api\//] }))

app.post('/chat/api/logins', (req, res) => {
  // if (req.body.name == 'admin' && req.body.password == '123456') {
  const tokenStr = jwt.sign({ name: req.body.name, password: req.body.password }, secretKey, {
    expiresIn: '10h'
  })
  return res.send({
    status: 200,
    message: '登录成功！',
    token: 'Bearer ' + tokenStr // 要发送给客户端的 token 字符串
  })
  // }
  // return res.send({ status: 400, msg: '换个账号密码' })
})

app.get('/chat/getUser', (req, res) => {
  res.send({
    status: 200,
    msg: '获取成功',
    data: req.user
  })
})

app.use((err, req, res, next) => {
  // token 解析失败
  if (err.name == 'UnauthorizedError') {
    return res.send({
      status: 401,
      message: '无效token'
    })
  }
  res.send({
    status: 500,
    message: '未知的错误'
  })
})

server.listen(3030, () => {
  console.log('listening on http://localhost:3030')
})

// io的书写
const user = []
io.on('connect', (socket) => {
  console.log('socket connected')
  socket.on('login', function (data) {
    console.log('登录人的信息如下所示')
    console.log(data)
    let index = user.findIndex((i) => i.name === data.name)
    if (index == 0) {
      socket.emit('loginErr', {
        status: 300,
        message: '该用户在线中'
      })
    } else if (index == -1) {
      user.push(data)
      socket.emit('loginSuccess', {
        status: 200,
        message: '登录成功',
        data
      })
    }
    socket.name = data.name
  })

  // 加入成员
  socket.on('myName', () => {
    io.emit('myNameReturn', socket.name)
  })

  // 在线的所有人
  socket.on('allBody', () => {
    io.emit('allBodyReturn', user)
  })

  // 发送消息
  socket.on('changeContent', (data) => {
    io.emit('changeContentReturn', data)
  })

  // 修改信息
  socket.on('setInfo', (data) => {
    let info = {}
    user.forEach((i) => {
      if (i.name == data.name) {
        i.name = data.newName
        i.introduce = data.introduce
        i.ava = i.ava
        info.ava = i.ava
        info.name = data.newName
        info.introduce = data.introduce
      }
    })
    socket.emit('setInfoReturn', info)
  })

  // 监听客户端断开
  socket.on('disconnect', () => {
    console.log('有人断开了连接')
    let index = user.findIndex((i) => i.name === socket.name)
    user.splice(index, 1)
    io.emit('live', {
      name: socket.name
    })

    // 离开之后的数组
    io.emit('afterBody', user)
  })
})
