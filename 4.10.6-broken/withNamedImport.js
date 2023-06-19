import { verifyToken } from '@clerk/clerk-sdk-node'
verifyToken(process.env.TOKEN).then(console.log)
