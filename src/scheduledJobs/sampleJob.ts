import cron from 'node-cron'

const sampleFn = () => console.log('running job')

export async function runSampleJob() {
  sampleFn()

  cron.schedule('0 * * * *', async () => sampleFn)
}
