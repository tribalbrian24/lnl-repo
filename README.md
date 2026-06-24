# REPO

Read `NEXTjs.md` and the following

## Localhost & Docker

repo-root: `docker compose down; docker compose up -d postgres redis redis-commander`
`apps/web/`: `npm run dev -- --port 9000`
`packages/db/`: `(node --env-file=../../.env --import tsx migrate.js)` or `(node --env-file=../../.env --import tsx rollback.js)`


## Environment Variables

### Root `.env`

```
WEB_PORT=9000
DATABASE_URL=postgresql://user:password@localhost:5432/onboarding_db
```

### Web `apps/web/.env`

```
DATABASE_URL=postgresql://user:password@localhost:5432/onboarding_db
```


### Other

 * `REDIS_URL`: Redis URL defaults to `redis://localhost:6379`
