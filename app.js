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
// var userIsConnected = true // 是否登录
// var currentUIDS = []
io.on('connect', (socket) => {
  var currentUID = null

  console.log('socket connected')
  socket.on('login', function (data) {
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

  // 登录状态
  // socket.on('userLogin', function (data) {
  //   if (data !== null) {
  //     if (currentUIDS.includes(data)) {
  //       userIsConnected = true
  //       currentUID = data
  //     }
  //   }
  // })

  // 监听客户端断开
  socket.on('disconnect', () => {
    console.log('有人断开了连接')
    let index = user.findIndex((i) => i.name === socket.name)
    user.splice(index, 1)
    io.emit('live', {
      name: socket.name
    })

    io.on('afterBody', () => {
      console.log(user)
      io.emit('afterBody', user)
    })

    // userIsConnected = false
    // setTimeout(function () {
    //   if (!userIsConnected) currentUIDS.pop(currentUID)
    // }, 15000)
  })
})

/*
  中间件
*/
// io.use(function(socket, next){
//   if (socket.request.headers.cookie) return next();
//   next(new Error('Authentication error'));
// });

/*
  广播
  broadcast:向除了正在连接的socket以外的其他已经连接的socket发送事件
  io.emit('pushMsg',"服务端返回的消息："+data)或者：
  io.on('connection', function (socket) {
    client++
    socket.broadcast.emit('newClientConnect', client + ' clients connects')
    socket.emit('newClientConnect', 'Hey, welcome')
    socket.on('disconnect', function () {
      client--
    })
  })
*/
/*
 *这段代码也是express结合socket的使用演示片段
 var app = require('express')();
 var http = require('http').Server(app);
 var io = require('socket.io')(http);

 app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
 })

 io.on('connection', function(socket) {
   socket.emit('news', 'Hello world');
   socket.on('my other event', function(data) {
     console.log(data);
   })
})

 http.listen(8001, function() {
   console.log('listen on 8001')
})
*/
