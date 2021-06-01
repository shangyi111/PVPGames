const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: {origin: "*"}
});

io.on('connection', (socket) => {
    // console.log('a user connected');
    // io.emit('test event', `${socket.id.substr(0,2)} said hi`);
    socket.on('message', (message) => {
        io.emit('test event', `${socket.id.substr(0,2)} said ${message}`);
    });
    socket.on('updatePlayerList', (user) => {
        io.emit('updatePlayerList', user);
    });
    socket.on('updateBoard', (board) => {
        io.emit('updateBoard', board);
    });
    socket.on('updateWinner', (user) => {
        io.emit('updateWinner', user);
    });
});

http.listen(3000, () => console.log('listening on http://localhost:3000'));