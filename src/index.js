const express = require('express');
const app = express();
const hbs =  require('hbs');
const port = process.env.PORT | 3000;
const path = require('path')
const http = require('http');
const socketIo = require('socket.io');
const Filter =require('bad-words');
var cons = require('consolidate');
const { generateMessage,generateLocationMessage } = require('./utils/message');
const { addUser, getUser, removeUser,getUsersInRoom } = require('./utils/users');

const views_path = path.join(__dirname,'../templates/views');

const publicDirectoryPath = path.join(__dirname,'../public');

const server = http.createServer(app);

const io = socketIo(server);

app.use(express.static(publicDirectoryPath));

//app.set('view engine', 'hbs');
//app.set('views',views_path);


app.engine('html', cons.swig)
app.set('views', views_path);
app.set('view engine', 'html');




io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})


app.get('/', (req, res) =>{
    res.render('index');
})

server.listen(port, () =>{
    console.log('Server has been started....')
})
