import * as db from 'zapatos/db'
import pool from '../db/pgPool'

export const initDB = async () => {
    db.sql`CREATE TABLE IF NOT EXISTS creatures (
            id SERIAL PRIMARY KEY,
            name VARCHAR(256),
            price INTEGER DEFAULT 0,
            health INTEGER DEFAULT 1,
            attack INTEGER DEFAULT 1,
            defence INTEGER DEFAULT 1,
            magic INTEGER DEFAULT 1,
            speed INTEGER DEFAULT 1
            
        );

    CREATE TABLE IF NOT EXISTS user_creatures (
            id SERIAL PRIMARY KEY,
            username VARCHAR(256),
            creature_id INTEGER,
            FOREIGN KEY (username) REFERENCES users(username),
            FOREIGN KEY (creature_id) REFERENCES creatures(id)
        )`.run(pool)
}