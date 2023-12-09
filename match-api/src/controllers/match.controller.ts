import { FastifyReply, FastifyRequest } from "fastify"
import { ICreature } from "../interfaces"
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