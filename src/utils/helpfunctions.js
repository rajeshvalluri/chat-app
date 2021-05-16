// Tester functions below
const {addUSer,removeUser,getUser,getUsersInRoom} = require('./users')
const users = [] // empty array of users to start off

addUSer({
    id:'34',
    username:'Kajal',
    room:'Coffe Break'
})

addUSer({
    id:'43',
    username:'Tamanna',
    room:'Coffe Break'
})

addUSer({
    id:'22',
    username:'Laya',
    room:'Bedroom'
})

addUSer({
    id:'19',
    username:'Malavika',
    room:'bedroom'
})



//Trying an empty username
const usr1 = addUSer({
    id:'34',
    username:'',
    room:'Coffe Break'
})
console.log(usr1)

const usr2 = addUSer({
    id:'34',
    username:'kajal',
    room:'Coffe Break'
})
console.log(usr2)

console.log(users)
//remove an user
console.log('Removing user ',removeUser('34').username)

console.log(users)

const fnduser = getUser('43')
console.log('Finding user with id 43', fnduser)

const fnduser1 = getUser('55')
console.log('Finding user with id 55', fnduser1)

console.log('Finding users in "bedroom"', getUsersInRoom('bedroom'))
console.log('Finding users in "funhouse"', getUsersInRoom('funhouse'))