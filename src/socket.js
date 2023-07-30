let admin = null;

const handler = (io) => {
    io.on('connection', (socket) => {

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
                console.log('Admin disconnected')
            } else {
                console.log('User disconnected')
            }
        })

        socket.on('step_one', (arr, cnn) => {
            socket.broadcast.emit('step_two', arr, cnn)
        })
    })
}

module.exports = { handler }