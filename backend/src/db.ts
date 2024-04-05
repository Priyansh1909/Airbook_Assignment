import { createPool } from 'mysql2/promise';

export async function connect() {
    const connection = await createPool({
        host: 'loalhost',
        port:3306,
        user: 'root',
        password: 'password',
        database: 'airbook'
    });

    return connection;
}