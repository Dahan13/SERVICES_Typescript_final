import * as db from 'zapatos/db'
import pool from '../db/pgPool'

export const initDB = async () => {
    db.sql`CREATE TABLE IF NOT EXISTS users (
                username VARCHAR(256) PRIMARY KEY,
                password VARCHAR(256),
                credits INTEGER DEFAULT 0,
                score INTEGER DEFAULT 0,
                is_admin boolean DEFAULT false,
                is_reporter boolean DEFAULT false,
                is_banned boolean DEFAULT false
            )`.run(pool)
}