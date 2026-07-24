// Unit tests must never touch a real database. Force mock data mode before
// any module under test parses the environment (env.MOCK is read at import).
process.env.MOCK = 'true'
