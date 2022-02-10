const server = new (require('./server'))(require('./routers'))

process.on('uncaughtException', err => {
    server.stop(() => {
        console.error({ err }, 'Uncaught Exception. Shutting down.')
        process.exit(1)
    })
})

process.on('unhandleRejection', err => {
    server.stop(() => {
        console.error({ err }, 'Uncaught Rejection. Shutting down.')
        process.exit(1)
    })
})

server.start(3000, () => console.log('Server start at port 3000'))