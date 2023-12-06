import fastify from 'fastify'
import 'dotenv/config'
import matchRouter from './routes/match.router'
import { initDB } from './db/initDB'

const port = 5000;
const host = '0.0.0.0'

const startServer = async () => {
    try {
        const server = fastify()
        await initDB()
        console.log("Database connected")

        const errorHandler = (error, address) => {
            server.log.error(error, address);
        }

        server.register(matchRouter, { prefix: '/api/match' })

        await server.listen({ host, port }, errorHandler)
    } catch (e) {
        console.error(e)
    }
}

process.on('unhandledRejection', (e) => {
    console.error(e)
    process.exit(1)
})

startServer()