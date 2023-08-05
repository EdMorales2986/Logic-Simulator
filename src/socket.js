let admin = null;
let user;

const handler = (io) => {
    io.on('connection', (socket) => {
        socket.on('join', (userId) => {
            user = userId
            socket.broadcast.emit('user_connect', userId)
        })

        if (!admin) {
            admin = socket
            console.log('Admin connected')
        } else {
            console.log('User connected')
        }

        socket.on('first_event', () => {
            if (socket === admin) {
                socket.emit('second_event', 'admin')
            } else {
                socket.emit('second_event', 'viewer')
            }
        });

        socket.on('disconnect', () => {
            if (socket === admin) {
                admin = null;
                socket.broadcast.emit('user_disconnect', user)
            } else {
                socket.broadcast.emit('user_disconnect', user)
            }
        })

        socket.on('step_one', (arr, cnn) => {
            socket.broadcast.emit('step_two', arr, cnn)
        })
    })
}

module.exports = { handler }