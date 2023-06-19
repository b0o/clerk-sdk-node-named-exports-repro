import clerk from '@clerk/clerk-sdk-node'
clerk.verifyToken(process.env.TOKEN).then(console.log)
