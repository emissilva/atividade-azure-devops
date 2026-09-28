const express = require('express');
const appInsights = require('applicationinsights');

// Configuração do Application Insights
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .start();
    console.log("App Insights configurado.");
} else {
    console.log("App Insights connection string não encontrada.");
}

const sql = require('mssql');
const app = express();
const port = process.env.PORT || 8080;

// Configuração do Banco de Dados (Os alunos devem preencher as variáveis no Azure WebApp)
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // Ex: meuserver.database.windows.net
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Necessário para Azure SQL
        trustServerCertificate: false
    }
};

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FIAP Music Cloud | CP4</title>
        <style>
            body {
                background-color: #0b1830;
                color: #ffffff;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
            }
            .container {
                background-color: #142640;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
                border-top: 5px solid #35d0be;
                max-width: 600px;
            }
            h1 {
                color: #35d0be;
                margin-top: 0;
            }
            p {
                font-size: 1.1em;
                line-height: 1.5;
                color: #cccccc;
            }
            .btn {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 24px;
                background-color: #147cbd;
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                transition: background-color 0.3s;
            }
            .btn:hover {
                background-color: #0b689f;
            }
            .badge {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 0.9em;
                margin-bottom: 15px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="badge">Azure SQL + CI/CD ativo ✅</div>
            <h1>Music Cloud · CP4</h1>
            <p>Catálogo de músicas publicado no Azure Web App com deploy automático pelo GitHub Actions.</p>
            <p>Os registros vêm do Azure SQL e a aplicação envia telemetria ao Application Insights.</p>
            <a href="/tema" class="btn">🎵 Ver catálogo de músicas</a>
        </div>
    </body>
    </html>
    `);
});

app.get('/tema', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(
            'SELECT id, titulo, artista, genero, ano_lancamento FROM dbo.Musicas ORDER BY id'
        );
        res.json(result.recordset);
    } catch (err) {
        console.error("Erro ao conectar no banco:", err);
        res.status(500).json({ erro: 'Não foi possível consultar as músicas.' });
    }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
});
