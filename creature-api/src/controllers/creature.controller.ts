import { FastifyReply, FastifyRequest } from "fastify"
import {ICreature, IUserCreature} from "../interfaces"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../db/pgPool'



export const listCreatures =
    async (request: FastifyRequest, reply: FastifyReply) => {
        return db.sql<s.creatures.SQL, s.creatures.Selectable[]>`SELECT * FROM ${"creatures"}`
            .run(pool)
            .then((creatures) => ({ data: creatures }))
    }

export const getCreature =
    async (request: FastifyRequest, reply: FastifyReply) => {
    const id = Number(request.params['id'])
    return await db.sql<s.creatures.SQL, s.creatures.Selectable[]>`SELECT * FROM ${"creatures"} WHERE ${"id"} = ${db.param(id)}`
        .run(pool)
        .then((user) => {
            if (user[0]) {
                return reply.send({data: user})
            } else {
                return reply.send({data: "Creature not found"})
            }
        })
}

export const createCreature =
    async (request: FastifyRequest, reply: FastifyReply) => {
        const creature: ICreature = request.body as ICreature;
        await db.sql<s.creatures.SQL, s.creatures.Selectable[]>`INSERT INTO ${"creatures"} (name, price, health, attack, defence, magic, speed) VALUES (${db.param(creature.name)}, ${db.param(creature.price)}, ${db.param(creature.health)}, ${db.param(creature.attack)}, ${db.param(creature.defense)}, ${db.param(creature.magic)}, ${db.param(creature.speed)})`.run(pool)
        reply.send({data: "201 - Successfull !"});
    }


export const addCreatureToUser =
    async (request: FastifyRequest, reply: FastifyReply) => {
        const userCreature: IUserCreature = request.body as IUserCreature;
        await db.sql<s.user_creatures.SQL, s.user_creatures.Selectable[]>`INSERT INTO ${"user_creatures"} (username, creature_id) VALUES (${db.param(userCreature.username)},${db.param(userCreature.creature_id)})`.run(pool)
        reply.send({data:"201 - Successful !"});
    }

export const getTeam =
    async (request: FastifyRequest, reply: FastifyReply) => {
        return await db.sql<s.user_creatures.SQL, s.user_creatures.Selectable[]>`SELECT * FROM ${"user_creatures"} WHERE ${"username"} = ${db.param(request.params['userid'])}`
            .run(pool)
            .then((team) => {
                if (team[0]) {
                    return reply.send({data: team})
                } else {
                    return reply.send({data: "User not found, or its team is empty"})
                }
            })
    }