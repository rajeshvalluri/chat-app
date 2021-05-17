const express = require('express')
const get_time = require('../src/utils/gettime')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage}  = require('../src/utils/generateMessage')
const {addUser,removeUser,getUser,getUsersInRoom,getRooms} = require('../src/utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3300
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {

    socket.on('sendmessage',(message, callback ) => {

        //get user details based on socket id. 
        //emit message to the room the user is in
        const user = getUser(socket.id)
        if (!user) {
            return ({error: 'User not found'})
        }
        const filter = new Filter()
        if (filter.isProfane(message) ) {
            return callback('Watch your langugae young man')

        }
        // socket.emit('message',generateMessage(message))
        io.to(user.room).emit('message',generateMessage(user.username,message))
        time = get_time()
        callback(`Message recieved at, ${time}`)
    })
    socket.on('disconnect', () => {
        const {user} = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message',generateMessage(`User ${user.username} has left`))
        }
    })
    socket.on('sendLocation',(position,callback) => {
        //get user details based on socket id. 
        //emit message to the room the user is in
        const user = getUser(socket.id)
        if (!user) {
            return ({error: 'User not found'})
        }
        socket.broadcast.emit('locationMessage',generateMessage(user.username,position))
        callback('Map URL received')
    })
    socket.on('join',({username,room},callback) => {
        const {error, user } = addUser({id: socket.id,username,room})
        // Display error message if user could not be added
        if (error) {
           return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generateMessage('Admin',`Welcome to the ${user.room} chat room, ${user.username}`))
        io.to(user.room).emit('message',generateMessage('Admin',"A New user has joined"))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)

        })
        io.emit('roomList', {
            rooms: getRooms()
        })
        // console.log(getRooms())
        // console.log(getUsersInRoom('sydney'))
        callback()
    })

})

server.listen(port)
    
console.log('Listening on port ',port)
