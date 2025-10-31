const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');

const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.send(`<a href="chat">Start Chat</a>`);
});
app.get('/chat', (req, res) => {
    console.log("Server is LIVE ......");
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
    // res.end();
});

io.on('connection', (socket) => {
    console.log(`user Connected:`, socket.id);
    // console.log(socket);
    socket.on('disconnect', () => {
        console.log("A user Disconnected:", socket.id);
    });
    // socket.on('setuser_name', (client) => {
    //     const user_name = client.name;
    //     console.log("User Name Set To: " + user_name);
    // });
    socket.on('chat message', (data) => {
        // console.log(data.user + " : " + data.msg + " : " + data.time);
        // console.log(data);
        const msgary = [];
        msgary.push(data);
        io.emit('message', msgary);
    });
});

server.listen(2000, () => {
    console.log(`http://localhost:2000/chat`);
});
