import express from 'express'
import * as dotenv from 'dotenv'
const app = express()
dotenv.config({ path: `${process.cwd()}/.env` })

import morgan from 'morgan'
import cors from 'cors'
import actualsRoutes from './routes/testRoutes'
import { runSampleJob } from './scheduledJobs'
import { genericExpressErrorHandler } from './controllers/error'
// import { authorizeRoute } from './controllers/auth';
import { connectToDB } from './config/server'

// activate morgan logging
app.use(morgan('dev'))

// establish DB connection
connectToDB().then(async () => {
  // dev stuff here
  // await createOrg().catch((err) => console.error(err.message));
})

// set whitelist - might be temporary before other security measures are established
const whiteList: RegExp[] = [
  /^http:\/\/localhost:300.$/,
  /^http:\/\/localhost:1234$/,
  /^https:\/\/sampledomain\.netlify\.app$/,
  /sampledomain\.netlify\.app/,
]

const corsOptions = {
  origin: (origin, callback) => {
    let found = false
    for (const reg of whiteList) {
      if (reg.test(origin)) {
        found = true
        break
      }
    }

    if (found || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Hey So This Isnt Allowed by CORS'))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

const port = process.env.PORT || 5001

// route parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// application routes
app.use('/api/sample', actualsRoutes)

app.use('*', genericExpressErrorHandler)

//run scheduled jobs
if (process.env.NODE_ENV !== 'local') {
  runSampleJob()
}

// Start Listening on Port
app.listen(port, () => {
  console.log(
    `A ${
      process.env.NODE_ENV ? process.env.NODE_ENV.toUpperCase() : 'NO ENV FILE'
    } Node JS Server is listening on port ${port}`,
  )
})
