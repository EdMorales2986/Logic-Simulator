export const socket = io();

// peerjs --port 3000
const htmlBody = document.querySelector('body');
const myPeer = new Peer(undefined, { host: '/', port: '3000' })
const peers = {}
const myAudio = document.createElement('audio');
myAudio.muted = true

myPeer.on('open', id => {
    socket.emit('join', (id))
})

navigator.mediaDevices.getUserMedia({
    audio: true
}).then(stream => {
    addAudioStream(myAudio, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const audio = document.createElement('audio')
        call.on('stream', userAudioStream => {
            addAudioStream(audio, userAudioStream)
        })
    })


    socket.on('user_disconnect', (userId) => {
        if (peers[userId]) { peers[userId].close() }
    })

    socket.on('user_connect', (userId) => {
        connectToNewUser(userId, stream)
    })
})


function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const audio = document.createElement('audio')
    call.on('stream', userAudioStream => {
        addAudioStream(audio, userAudioStream)
    })
    call.on('close', () => {
        audio.remove()
    })

    peers[userId] = call
}

function addAudioStream(audio, stream) {
    audio.srcObject = stream;
    audio.addEventListener('loadedmetadata', () => {
        audio.play()
    })
    htmlBody.append(audio)
}