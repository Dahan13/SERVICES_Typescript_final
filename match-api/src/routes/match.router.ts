import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers/match.controller'

async function matchRouter(fastify: FastifyInstance) {

    // TODO : Update handlers

    fastify.route({
        method: 'GET',
        url: '/rounds/',
        handler: controllers.listRounds,
    })

    fastify.route({
        method: 'POST',
        url: '/rounds/',
        handler: controllers.createRound,
    })

    fastify.route({
        method: 'GET',
        url: '/rounds/:id',
        handler: controllers.getRoundById,
    })

    fastify.route({
        method: 'GET',
        url: '/',
        handler: controllers.listMatches,
    })

    fastify.route({
        method: 'POST',
        url: '/',
        handler: controllers.createMatch,
    })

    fastify.route({
        method: 'GET',
        url: '/:id',
        handler: controllers.getMatchById,
    })

    
}

export default matchRouter