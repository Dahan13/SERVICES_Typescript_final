import * as db from 'zapatos/db'
import pool from '../db/pgPool'

export const initDB = async () => {
    db.sql`CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        host VARCHAR(256),
        challenger VARCHAR(256),
        status INTEGER DEFAULT 0,
        winner VARCHAR(256) REFERENCES users(username),
        creation_date timestamp DEFAULT now(),
        beginning_date timestamp,
        ending_date timestamp,
        FOREIGN KEY (host) REFERENCES users,
        FOREIGN KEY (challenger) REFERENCES users
        );

    CREATE TABLE IF NOT EXISTS rounds (
        id SERIAL PRIMARY KEY,
        match_id INTEGER REFERENCES matches(id),
        host_creature INTEGER REFERENCES user_creatures(id),
        challenger_creature INTEGER REFERENCES user_creatures(id),
        status INTEGER DEFAULT 0,
        winner VARCHAR(256) REFERENCES users(username),
        FOREIGN KEY (match_id) REFERENCES matches
        );`.run(pool)
}