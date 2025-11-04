const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 9890;

const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send(`<a href="chat">Start Chat</a>`)
})
app.get('/chat', (req, res) => {
    console.log("Server is LIVE ......");
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

var users = 0;

io.on('connection', (socket) => {
    users++;
    console.log(`user Connected:`, socket.id);
    io.emit('usercount', users);

    socket.on('chat message', (data) => {
        console.log(data.user + " : " + data.msg + " : " + data.time);
        // console.log(data);
        const msgary = [];
        msgary.push(data);
        io.emit('message', msgary);
    });

    socket.on('disconnect', () => {
        users--;
        io.emit('usercount', users);
        console.log("A user Disconnected:", socket.id);
    });

});

server.listen(PORT, () => {
    console.log(`Server is started`);
});
