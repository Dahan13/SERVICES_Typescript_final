import { FastifyReply, FastifyRequest } from "fastify"
import { IMatch, IRound } from "../interfaces"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../db/pgPool'
import {matches} from "zapatos/schema";
import axios from 'axios';



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


export const joinMatchByUsername =
    async (request: FastifyRequest, reply: FastifyReply) => {
        const match_id = Number(request.params['matchId']);
        const username = String(request.params['username']);
        return await db.sql<s.matches.SQL, s.matches.Updatable[]>`UPDATE ${"matches"} SET ${"challenger"} = ${db.param(username)} WHERE ${"id"} = ${db.param(match_id)}`
            .run(pool)
            .then(() => {
                return reply.send({data: `${username} joined the match `})
            })
        }

export const advanceMatch =
        async (request: FastifyRequest, reply: FastifyReply) => {
            // Three cases : status = 0, we have to create a new round. Status = 1, if the current round is over, we check how many rounds were made. If it's 5, we end the match.
            // Else, we create a new round. Status = 2, do nothing match over.
            const id = request.params["matchId"];
            let matchInfos = await db.sql<s.matches.SQL, s.matches.Selectable[]>`SELECT * FROM ${"matches"} WHERE ${"id"} = ${db.param(id)}`.run(pool);
            let matchInfo = matchInfos[0];
            if (!matchInfo) {
                return reply.send({data: "Match not found"})
            }

            if (matchInfo.status == 2) {
                return reply.send({data: "The match is already over !"})
            } else if (matchInfo.status == 1) {
                // We begin by retrieving all infos of the match rounds
                let rounds = await db.sql<s.rounds.SQL, s.rounds.Selectable[]>`SELECT * FROM ${"rounds"} WHERE ${"match_id"} = ${db.param(id)}`.run(pool)

                // Now we check if one of the ongoing round is not finished, if its the case we won't advance the match
                let all_rounds_finished = true;
                let unfinished_id: Number;
                for (let i = 0; i < rounds.length; i++) {
                    if (rounds[i].status != 2) {
                        all_rounds_finished = false
                        unfinished_id = rounds[i].id
                        break;
                    }
                }
                if (all_rounds_finished == false) {
                    return reply.send({data: `Round ${unfinished_id} is not over yet`})
                }

                // Now we check if all 5 rounds were done or not
                if (rounds.length >= 5) { // We have to check if all rounds are finished to wrap it up
                    // We can now designate a winner
                    let challenger_score = 0
                    let host_score = 0
                    for (let i = 0; i < rounds.length; i++) {
                        if (rounds[i].winner == matchInfo.host) {
                            host_score += 1;
                        } else {
                            challenger_score += 1
                        }
                    }
                    let winner: string;
                    if (host_score > challenger_score) {
                        winner = matchInfo.host
                    } else {
                        winner = matchInfo.challenger
                    }

                    // We can update the database and return the match infos
                    let update = await db.sql<s.matches.SQL, s.matches.Updatable[]>`UPDATE ${"matches"} SET ${"winner"} = ${db.param(winner)}, ${"status"} = 2, ${"ending_date"} = NOW() WHERE ${"id"} = ${db.param(id)}`.run(pool)
                    return reply.send({data: `${winner} has won the match`});
                } else { // All rounds are finished but not 5 were made
                    // We simply create a new round
                    let insert = await db.sql<s.rounds.SQL, s.rounds.Insertable>`INSERT INTO ${"rounds"} (match_id) VALUES (${db.param(matchInfo.id)})`.run(pool)
                    return reply.send({data: "A new round has been created"});
                }
            } else { // we start the match
                if (!matchInfo.challenger) {
                    return reply.send({data: "Challenger has not been set yet !"})
                }
                // We create the new round
                let insert = await db.sql<s.rounds.SQL, s.rounds.Insertable>`INSERT INTO ${"rounds"} (match_id) VALUES (${db.param(matchInfo.id)})`.run(pool)

                // We update the beginning date of the match
                let updates = await db.sql<s.matches.SQL, s.matches.Updatable[]>`UPDATE ${"matches"} SET ${"beginning_date"} = NOW(), ${"status"} = 1 WHERE ${"id"} = ${db.param(id)}`.run(pool)
                let update = updates[0]
                return reply.send({data: "Match successfully initiated"});
            }
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

    //a changer, non testé
export const resolveRound =
    async (request: FastifyRequest, reply: FastifyReply) => {
        const id = Number(request.params['id']);
        // ? We begin by checking if both creatures were chosen
        let roundInfos = await db.sql<s.rounds.SQL, s.rounds.Selectable[]>`SELECT * FROM ${"rounds"} WHERE ${"id"} = ${db.param(id)}`.run(pool);
        let roundInfo = roundInfos[0]
        if (roundInfo.challenger_creature == null || roundInfo.host_creature == null) {
            return reply.send({data: "Creatures have not been chosen yet !"})
        } else if (roundInfo.winner) {
            return reply.send({data: "Round has already been resolved"})
        }

        // ? Now we need to get our creatures infos to decide the winner
        let host_pokemon_api = await axios.get(`http://creatureapi:5000/api/creature/${roundInfo.host_creature}`)
        let challenger_pokemon_api = await axios.get(`http://creatureapi:5000/api/creature/${roundInfo.challenger_creature}`)
        let host_pokemon = host_pokemon_api.data.data[0]
        let challenger_pokemon = challenger_pokemon_api.data.data[0]
        // The winner is decided by price
        let winner: string;
        let winner_identity: string;
        if (host_pokemon.price > challenger_pokemon.price) {
            winner_identity = "host";
        } else if (host_pokemon.price < challenger_pokemon.price) {
            winner_identity = "challenger";
        } else { // If they have the same price, it is decided randomly
            let random: number = Math.random();
            if (random < 0.5) {
                winner_identity = "host";
            } else {
                winner_identity = "challenger";
            }
        }
        // Now we retrieve from match the username of the host or the challenger
        let matchInfos = await db.sql<s.matches.SQL, s.matches.Selectable[]>`SELECT * FROM ${"matches"} WHERE ${"id"} = ${db.param(roundInfo.match_id)}`.run(pool);
        let matchInfo = matchInfos[0];
        if (winner_identity == "host") {
            winner = matchInfo.host
        } else {
            winner = matchInfo.challenger
        }
        

        // We update accordingly the round infos
        return await db.sql<s.rounds.SQL, s.rounds.Selectable[]>`UPDATE ${"rounds"} SET ${"status"} = 2, ${"winner"} = ${db.param(winner)} WHERE ${"id"} = ${db.param(id)}`
            .run(pool)
            .then((round) => {
                return reply.send({data: "Successfull !"})
            })
    }

    ///rounds/:roundId/challenger/:creatureId
export const insertRoundChallenger =
    async (request: FastifyRequest, reply: FastifyReply) => {
        const round_id = Number(request.params['roundId']);
        const creature_id = Number(request.params['creatureId']);
        return await db.sql<s.rounds.SQL, s.rounds.Selectable[]>`UPDATE ${"rounds"} SET ${"challenger_creature"} = ${db.param(creature_id)} WHERE ${"id"} = ${db.param(round_id)}`
            .run(pool)
            .then(() => {
                return reply.send({data: "200 - Successfull"})
            })
    }

    ///rounds/:id/host/:creatureId
export const insertRoundHost =
    async (request: FastifyRequest, reply: FastifyReply) => {
        const round_id = Number(request.params['id']);
        const creature_id = Number(request.params['creatureId']);
        return await db.sql<s.rounds.SQL, s.rounds.Selectable[]>`UPDATE ${"rounds"} SET ${"host_creature"} = ${db.param(creature_id)} WHERE ${"id"} = ${db.param(round_id)}`
            .run(pool)
            .then(() => {
                return reply.send({data: "200 - Successfull"})
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