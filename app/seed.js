const fs = require('node:fs');
const path = require('node:path');
const sql = require('mssql');

async function main() {
    const required = ['DB_SERVER', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
    for (const name of required) {
        if (!process.env[name]) throw new Error(`Variável ausente: ${name}`);
    }

    const pool = await sql.connect({
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        options: { encrypt: true, trustServerCertificate: false },
        connectionTimeout: 30000
    });
    try {
        const source = fs.readFileSync(path.join(__dirname, '..', 'sql', '01_musicas.sql'), 'utf8');
        const batches = source.split(/^GO\s*$/gim).map(s => s.trim()).filter(Boolean);
        let result;
        for (const batch of batches) result = await pool.request().query(batch);
        console.table(result.recordset);
        if (result.recordset.length !== 5) throw new Error('A tabela deve conter exatamente cinco músicas.');
    } finally {
        await pool.close();
    }
}

main().catch(err => { console.error(err.message); process.exitCode = 1; });
