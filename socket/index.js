const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: {origin: "*"}
});


io.on('connection', (socket) => {
    // console.log('a user connected');
    // io.emit('test event', `${socket.id.substr(0,2)} said hi`);
    socket.on('join', function(data) {
        //console.log(data)
        socket.join(data.room);
    });
    socket.on('leave', function(data) {
        //console.log(data)
        socket.leave(data.room);
    });
    socket.on('message', (message) => {
        io.emit('test event', `${socket.id.substr(0,2)} said ${message}`);
    });
    socket.on('updatePlayerList', (user) => {
        io.to(user.room).emit('updatePlayerList', user);
    });
    socket.on('updateBoard', (board) => {
        //console.log(board);
        io.sockets.in(board.room).emit('updateBoard', board);
    });
    socket.on('updateWinner', (user) => {
        io.to(user.room).emit('updateWinner', user);
    });
    socket.on('updateRoom', (data) => {
        io.to(data.room).emit('updateRoom', data);
    });
    socket.on('updateRoomsDb', (data) => {
        io.emit('updateRoomsDb', data);
    });
});

http.listen(3000, () => console.log('listening on http://localhost:3000'));