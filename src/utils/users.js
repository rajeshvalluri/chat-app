// four functions are being created here!!
// addUSer, removeUser, getUser, getUsersInRoom

const users = []
const rooms = []
const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the username and room
    if (!username || !room) {
        return { error: 'Username and Room required'}
    }

    //check for existing user
    // returns a boolean if a user is present in a given room already
    // Changing the business rule that a user name is only unique to a room
    // In stead I am enforcing a username to be unique across lounge so that they can switch rooms
    const existingUser = users.find( (user) => {
        return user.username === username
        // return user.room === room  && user.username === username

    })

    if (existingUser) {
        return { error:'Username is taken'}
    }
    //Check if room exists, if it doesn't add room to the rooms array
    const existingRoom = rooms.find( (rm) => {
        return rm.roomname === room
    })

    if(!existingRoom) {
        const newroom = {'roomname': room}
        rooms.push(newroom)
    }
    // At this point, username is not present in the room the user is trying to join
    // Go ahead and add the user to the room
    // users.push({id, username,room}) // if we use this line, we will not be able to return the newly created user
    const user = {id, username,room}
    users.push(user)
    return({user})
}

const removeUser = (id) => {
//Boolean to find user by Id

    const index = users.findIndex( (user) => {
        return user.id === id
    })
    if (index != -1) { // useer found in the index
       return ({user : users.splice(index,1)[0]})
    } else {
        return({error:'An error has occurred'})
    }
}

const getUser = (id) => {
    const user = users.find( (user) => {
        return user.id === id
    })
    if (!user) {
        return {error:'User not found'}
    }
    return user
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const usersInRoom = users.filter( (user) => {
        return user.room === room
    })
    return usersInRoom
}

const getRooms = () => {
    return rooms
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms
}
