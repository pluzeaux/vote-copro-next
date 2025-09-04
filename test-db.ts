import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Connexion à la base réussie !')
  } catch (err) {
    console.error('❌ Erreur de connexion :', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
