import cors from 'cors'
import express from 'express'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import { resolveSession } from './middleware/auth.js'
import applicationsRoutes from './routes/applications.js'
import gigsRoutes from './routes/gigs.js'
import profileRoutes from './routes/profile.js'
import reviewsRoutes from './routes/reviews.js'
import systemRoutes from './routes/system.js'
import usersRoutes from './routes/users.js'

const app = express()

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }))

if (auth) app.all('/api/auth/*splat', toNodeHandler(auth))
app.use(express.json())

app.use('/api', resolveSession)

app.use('/api', systemRoutes)
app.use('/api', profileRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/gigs', gigsRoutes)
app.use('/api/applications', applicationsRoutes)
app.use('/api/reviews', reviewsRoutes)

app.use((err, _req, res, next) => {
  if (res.headersSent) return next(err)
  const status = err.status || err.statusCode || 500
  if (status >= 500) console.error(err)
  const message = status >= 500
    ? 'Internal server error'
    : err.type === 'entity.parse.failed' ? 'Invalid JSON in request body' : err.message
  res.status(status).json({ error: message })
})

export default app
