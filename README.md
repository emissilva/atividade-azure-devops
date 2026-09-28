# CP4 — Músicas no Azure

Aplicação Node.js do CP4 de Cloud Solutions & Scalable Infrastructure (FIAP 2TSCPW). Fork do [projeto-base](https://github.com/karlosmiguell/atividade-azure-devops), adaptado para consultar o Azure SQL e publicado automaticamente com GitHub Actions.

## Participante

Emerson dos Santos Silva — RM562033.

## Fluxo

1. `sql/01_musicas.sql` cria `dbo.Musicas` e insere cinco músicas.
2. `app/index.js` expõe `/` (interface), `/tema` (SELECT no banco) e `/health`.
3. O workflow `.github/workflows/main.yml` instala as dependências e publica a branch `main` no WebApp `cp4-musicas-rm562033`.
4. O segredo `AZURE_WEBAPP_PUBLISH_PROFILE` contém o perfil de publicação do WebApp. As variáveis `DB_SERVER`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` e `APPLICATIONINSIGHTS_CONNECTION_STRING` ficam nas configurações do WebApp, sem credenciais no repositório.

## Desenvolvimento local

```bash
cd app
npm ci
npm start
```

`GET /health` funciona sem banco. `GET /tema` precisa das quatro variáveis `DB_*` apontando para um SQL Server acessível.

## Infraestrutura

O script de provisionamento e a documentação com comandos e evidências estão na pasta `cp4/` do trabalho local. A assinatura Azure for Students bloqueou Brazil South para o SQL Server; o banco foi criado em Canada Central e o App Service em East US 2. A regra SQL `0.0.0.0–0.0.0.0` permite os serviços Azure e uma segunda regra limita a carga inicial ao IP do cliente. O plano é Windows F1.

## Referências

- [Ícones oficiais do Azure Architecture Center](https://learn.microsoft.com/azure/architecture/icons/)
- [Regras de firewall do Azure SQL](https://learn.microsoft.com/azure/azure-sql/database/firewall-configure)
