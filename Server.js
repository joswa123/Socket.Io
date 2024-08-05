const http = require('http');
const socketIo = require('socket.io');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO server running\n');
});

// Attach Socket.IO to the server
const io = socketIo(server, {
  cors: {
    origin: "file:///D:/SocketIo/Index.html", // Allow requests from any origin
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const users = {};

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

// Listen for client connections
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Handle new user event
  socket.on('new-user', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });

  // Handle chat message event
  socket.on('send-chat-message', (message) => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
  });

  // Handle user typing event
  socket.on('user-typing', () => {
    const comments = 'typing';
    socket.broadcast.emit('others-typing', { comments, name: users[socket.id] });
  });

  // Handle user disconnection event
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});
