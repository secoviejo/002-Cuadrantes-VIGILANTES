import crypto from 'crypto'

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

const targetHash = '7dbb7f051b44d7d54584a7bc6c32f00da5a3b5e6973485b9fb176fe56346b3e3'
const candidates = ['Demo1234!', 'admin123', 'password123', 'demo123', '123456', 'unizar123', 'cuadrantes123', 'admin', 'password']

console.log('--- Verificación de Hash SHA-256 ---')
candidates.forEach(pwd => {
    const h = hashPassword(pwd)
    const match = h === targetHash ? '✅ COINCIDE!' : '❌'
    console.log(`Password: [${pwd}] -> Hash: ${h} ${match}`)
})
