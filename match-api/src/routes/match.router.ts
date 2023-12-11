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
    
    //non testé
    fastify.route({
        method: 'PUT',
        url: '/:matchId/join/:username',
        handler: controllers.joinMatchByUsername,
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

    //nonteste
    fastify.route({
        method: 'PUT',
        url: '/rounds/:id/resolve',
        handler: controllers.resolveRound,
    })

    //nonteste
    fastify.route({
        method: 'PUT',
        url: '/rounds/:roundId/challenger/:creatureId',
        handler: controllers.insertRoundChallenger,
    })
    
    //nonteste
    fastify.route({
        method: 'PUT',
        url: '/rounds/:id/host/:creatureId',
        handler: controllers.insertRoundHost,
    })
    
}

export default matchRouter