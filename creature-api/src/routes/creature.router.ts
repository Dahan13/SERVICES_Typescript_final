import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers/creature.controller'

async function creatureRouter(fastify: FastifyInstance) {

    // TODO : Update handlers

    fastify.route({
        method: 'GET',
        url: '/',
        handler: controllers.listCreatures,
    })

    fastify.route({
        method: 'POST',
        url: '/',
        handler: controllers.createCreature,
    })

    fastify.route({
        method: 'GET',
        url: '/:id',
        handler: controllers.getCreature,
    })

    fastify.route({
        method: 'POST',
        url: '/userCreature',

        handler: controllers.addCreatureToUser,
    })

    fastify.route({
        method: 'POST',
        url: '/userCreature/team/:userid',

        handler: controllers.getTeam,
    })
}

export default creatureRoute