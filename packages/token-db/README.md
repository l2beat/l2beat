

# Token-DB

## Run as queue

1. Setup Redis service (see below)

2. Setup Database

3. Put redis and database connection details in `.env` (see `.env.example`)

4. Push schema to database: 
```bash
yarn db:push
```
5. Provide details for the chains (rpc/explorers)
By default, RPCs shipped with the view will be used. To override, provide the details in `.env` (see `.env.example`)
By default, explorers are not used. To use, provide the details in `.env` (see `.env.example`)

6. Seed database:
```bash
yarn db:seed
```

7. Enable queue dashboard by setting `QUEUE_DASHBOARD_PORT=<port>` in `.env` to a port number you want to use for the dashboard - by default it is disabled:

```bash
QUEUE_DASHBOARD_PORT=3000
```

8. Start the queue:
```bash
yarn queue
```

> Check out current queue schema here: [Queue schema](https://link.excalidraw.com/l/1Pobo8fNXle/22icgOkmpSn)


## Redis
Run redis server:
```bash
docker-compose up
```

Flush redis while service is running:
```bash
docker-compose exec redis redis-cli flushall
```

