const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const http = require('http');
const auth = require('./Routers/Auth');
const image = require('./Routers/Image');
const message = require('./Routers/Message');
const chat = require('./Routers/Chat');
const login = require('./Routers/Login');
const groups = require('./Routers/Group');
const bodyParser = require("body-parser");
const socket = require('socket.io');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({secret: "cats", resave: false, saveUninitialized: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.set('strictQuery', false);
const mongoDb = process.env.MONGODB_URL;

async function main(){
    mongoose.connect(mongoDb);
};

main().catch((err) => console.log(err));

app.use('/api/register', auth);
app.use('/api/login', login);
app.use('/api/postimage', image);
app.use('/api/message', message);
app.use('/api/chat', chat);
app.use('/api/group', groups);


const server = app.listen(process.env.PORT, () => console.log(`App is listening on ${process.env.PORT}`));

const io = socket(server, {
    cors: {
        origin: process.env.FRONTEND,
        credentials: true,
    }
});

io.on('connection', (socket) => {
    console.log('connected:' +socket.id);

    socket.on('join_chat', (data) => {
        console.log(`user ${socket.id} joined the room ${data}`)
        socket.join(data);
    });

    socket.on('send_message', (data) => {
        socket.to(data.chat).emit('receive_message', data);
        console.log(data);
    });

    socket.on('disconnect', () => {
        console.log('disconnected:' + socket.id);
    });
});