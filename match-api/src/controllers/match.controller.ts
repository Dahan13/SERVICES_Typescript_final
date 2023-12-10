import { FastifyReply, FastifyRequest } from "fastify"
import { IMatch, IRound } from "../interfaces"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../db/pgPool'
import {matches} from "zapatos/schema";



export const listMatches =
    async (request: FastifyRequest, reply: FastifyReply) => {
        return db.sql<s.matches.SQL, s.matches.Selectable[]>`SELECT * FROM ${"matches"}`
            .run(pool)
            .then((creatures) => ({ data: creatures }))
    }

export const createMatch =
    async (request: FastifyRequest, reply: FastifyReply) => {
        const match = request.body as IMatch;
        return db.sql<s.matches.SQL, s.matches.Selectable[]>`INSERT INTO ${"matches"} (host) VALUES (${db.param(match.host)})`
            .run(pool)
            .then(() => {
                return reply.send({data: "201 - Successfull !"});
            })
    }

export const getMatchById =
    async (request: FastifyRequest, reply: FastifyReply) => {
        const id = Number(request.params['id']);
        return await db.sql<s.matches.SQL, s.matches.Selectable[]>`SELECT * FROM ${"matches"} WHERE ${"id"} = ${db.param(id)}`
            .run(pool)
            .then((match) => {
                if (match[0]) {
                    return reply.send({data: match})
                } else {
                    return reply.send({data: "Match not found !"})
                }
            })
    }

export const listRounds =
    async (request: FastifyRequest, reply: FastifyReply) => {
        return db.sql<s.rounds.SQL, s.rounds.Selectable[]>`SELECT * FROM ${"rounds"}`
            .run(pool)
            .then((rounds) => ({ data: rounds }))
    }

export const createRound =
    async (request: FastifyRequest, reply: FastifyReply) => {
        const round = request.body as IRound;
        return db.sql<s.rounds.SQL, s.rounds.Selectable[]>`INSERT INTO ${"rounds"} (match_id) VALUES (${db.param(round.match_id)})`
            .run(pool)
            .then(() => {
                return reply.send({data: "201 - Successfull !"});
            })
    }

export const getRoundById =
    async (request: FastifyRequest, reply: FastifyReply) => {
        const id = Number(request.params['id']);
        return await db.sql<s.rounds.SQL, s.rounds.Selectable[]>`SELECT * FROM ${"rounds"} WHERE ${"id"} = ${db.param(id)}`
            .run(pool)
            .then((round) => {
                if (round[0]) {
                    return reply.send({data: round})
                } else {
                    return reply.send({data: "Round not found !"})
                }
            })
    }

// export const getCreature =
//     async (request: FastifyRequest, reply: FastifyReply) => {
//     const id = Number(request.params['id'])
//     return await db.sql<s.creatures.SQL, s.creatures.Selectable[]>`SELECT * FROM ${"creatures"} WHERE ${"id"} = ${db.param(id)}`
//         .run(pool)
//         .then((user) => {
//             if (user[0]) {
//                 return reply.send({data: user})
//             } else {
//                 return reply.send({data: "User not found"})
//             }
//         })
// }
//
// export const createUser =
//     async (request: FastifyRequest, reply: FastifyReply) => {
//     const user: ICreature = request.body as ICreature;
//     // const users = await db.sql<s.users.SQL, s.users.Selectable[]>`SELECT * FROM ${"users"}`.run(pool)
//
//     await db.sql<s.users.SQL, s.users.Selectable[]> `INSERT INTO ${"users"} VALUES (${db.param(user.username)}, ${db.param(user.password)})`.run(pool)
//     return reply.send({data: "Done !"})
// }
//
// export const updateUser =
//     async (request: FastifyRequest, reply: FastifyReply) => {
//         const id = String(request.params['id'])
//         const users = await db.sql<s.users.SQL, s.users.Selectable[]>`SELECT * FROM ${"users"}`.run(pool)
//         for (let i = 0; i < users.length; i++) {
//             if (users[i].username === id) {
//                 const newInfos = request.body
//                 for (let j = 0; j < Object.keys(newInfos).length; j++) {
//                     users[i][Object.keys(newInfos)[j]] = newInfos[Object.keys(newInfos)[j]]
//                 }
//                 let user = await db.sql<s.users.SQL, s.users.Insertable> `UPDATE ${"users"} SET ${"username"} = ${db.param(users[i].username)}, ${"score"} = ${db.param(users[i].score)} WHERE ${"username"} = ${db.param(users[i].username)}`.run(pool)
//                 reply.send({data: "Done !"})
//             }
//         }
// }