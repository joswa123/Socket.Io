//todo:need to create http server & cors
//we can keep client & server in same folder because both are runned in differnt port
const io = require('socket.io')(3000)

const users = {};

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    //broadcast will sent the message everyOne but not to you;
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id]})

  })
  socket.on('user-typing', _message => {
    let comments='typing'
    socket.broadcast.emit('others-typing', {comments:comments,name: users[socket.id]})

  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})  