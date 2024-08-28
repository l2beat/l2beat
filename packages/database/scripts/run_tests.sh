source .env

export PRISMA_DB_URL=$TEST_DB_URL && 

yarn db:migrate && 

mocha --timeout 10000

