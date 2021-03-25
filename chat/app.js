const express = require('express');
const io = require('socket.io')(server);
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});
server = app.listen('3000', () => console.log('Server is running...'));

io.on('connection', (socket) => {
    console.log('New user connected');
});

io.on('connection', (socket) => {
    console.log('Connected new user');

    socket.username = 'Incognito';

    socket.on('change_username', (data) => {
        socket.username = data.username;
    });
});
