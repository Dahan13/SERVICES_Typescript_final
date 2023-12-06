import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers/creature.controller'

async function cratureRouter(fastify: FastifyInstance) {

    // TODO : Update handlers

    fastify.route({
        method: 'GET',
        url: '/',
        handler: controllers.listCreatures,
    })

    fastify.route({
        method: 'POST',
        url: '/',
        handler: controllers.createUser,
    })

    fastify.route({
        method: 'GET',
        url: '/:id',
        handler: controllers.getCreature,
    })

    fastify.route({
        method: 'PUT',
        url: '/:id',

        handler: controllers.updateUser,
    })
}

export default cratureRouter