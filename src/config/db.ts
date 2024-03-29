import { connect, connection } from 'mongoose'
import { mongoURI } from './envVariables'

export const connectToDB = async (): Promise<void> => {
  await connect(mongoURI)
  console.log(`Connected To  Mongo DB at address ${mongoURI}\n`)

  connection.on('error', (err) => {
    console.error('Error connecting to Mongo DB server\n')
    console.error(err.message)
  })
}
