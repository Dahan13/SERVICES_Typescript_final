import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers/match.controller'

async function matchRouter(fastify: FastifyInstance) {

    // TODO : Update handlers
    //-----     MATCH   -----
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
    
    fastify.route({
        method: 'PUT',
        url: '/:matchId/join/:username',
        handler: controllers.joinMatchByUsername,
    })

    fastify.route({
        method: 'PUT',
        url: '/:matchId/advance',
        handler: controllers.advanceMatch,
    })
    

    //-----     ROUND   -----
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
        method: 'PUT',
        url: '/rounds/:id/resolve',
        handler: controllers.resolveRound,
    })

    fastify.route({
        method: 'PUT',
        url: '/rounds/:roundId/challenger/:creatureId',
        handler: controllers.insertRoundChallenger,
    })
    
    fastify.route({
        method: 'PUT',
        url: '/rounds/:id/host/:creatureId',
        handler: controllers.insertRoundHost,
    })
    
}

export default matchRouter