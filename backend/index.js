const express = require('express');
const { connection } = require('./db');
const { userRoute } = require('./routes/user.route');
const path = require('path');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 4000;

// Apply CORS middleware before defining routes
app.use(cors());

app.use(express.json());
app.use('/users', userRoute);

const server = app.listen(PORT, async () => {
    try {
        await connection;
        console.log('Connection done');
        console.log(`Server on port ${PORT}`);
    } catch (err) {
        console.log(err);
    }
});

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://127.0.0.1:5501'||'http://localhost:4000', // Allow all origins for now
        methods: ['GET', 'POST'],
    },
});

app.use(express.static(path.join(__dirname, 'view/index.html')));

io.on('connection', onConnected);

let socketsConnected = new Set();

function onConnected(socket) {
    console.log(socket.id);
    socketsConnected.add(socket.id);

    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    });

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-mesg', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
}
