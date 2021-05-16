const socket = io()

//Define elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $roomdata = document.querySelector('#room_data')

//define templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const mapsURLTemplate = document.querySelector('#mapsURL-template').innerHTML
const sidebarTemplate  = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild
    
    //height of the new messages
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin 

    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //how far was the scrolling
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }


}

socket.on('message',(message) => {
    const html = Mustache.render(messageTemplate,{
        'username': message.username,
        'message' : message.text, 
        'createdAt': moment(message.createdAt).format('HH:mm:A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll() 
})

socket.on('locationMessage',(location) => {
    const html = Mustache.render(mapsURLTemplate,{
        'username':location.username,
        'location':location.text,
        'createdAt': moment(location.createdAt).format('HH:mm:A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData', ({room,users}) => {
    const html = Mustache.render(sidebarTemplate, {
        'room': room,
        'users': users
    })
    $roomdata.innerHTML = html
})

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated',count)
// })
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //disable the form until acknowledgement received
    $messageFormButton.setAttribute('disabled','disabled')

    var inputTxt = $messageFormInput.value

    socket.emit('sendmessage',inputTxt,(error,acknowledgement) => {
        //enable the send button again
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        if (error) {
            return console.log(error)
        }
    })
})
$sendLocationButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition( (position) => {
        const location = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        }
        const googleMapsURL = `https://google.com/maps?q=${location.latitude},${location.longitude}`
        socket.emit('sendLocation',googleMapsURL, (acknowledgement) => {
            $sendLocationButton.removeAttribute('disabled')
        })
    })

})

socket.emit('join',{username, room},(error) => {

    if (error) {
        alert (error)
        location.href = '/'
    }

})
