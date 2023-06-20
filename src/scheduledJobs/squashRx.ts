import cron from 'node-cron'
import { chromium, Page } from 'playwright'
import { squashRxURI, squashRxUsername, squashRxPassword } from '../config/envVariables'

async function loginToSquashRx(page: Page) {
  const signInButton = await page.locator('.sign-in')
  await signInButton.click()

  await page.locator('input.email-login').fill(squashRxUsername)
  await page.locator('input.password-login').fill(squashRxPassword)

  await page.getByText('LOG IN', { exact: true }).click()
}
async function goToSquashRx() {
  console.log('starting squash rx job')

  const browser = await chromium.launch({
    headless: false,
  })

  const page = await browser.newPage()
  await page.goto(squashRxURI)
  page.on('response', async (response) => {
    console.log('<<', response.url())
    if (response.status() !== 200) return
    try {
      const responseBody = await response.body()
      const data = JSON.parse(await response.text())
      // console.log(responseBody) // returns <Buffer xx xx
      console.log(data) // returns body
    } catch (err) {
      console.error(err)
    }
  })

  await page.waitForTimeout(6000)

  await loginToSquashRx(page)

  await browser.close()
}

export async function runSquashRXJob() {
  goToSquashRx()

  cron.schedule('0 * * * *', async () => goToSquashRx())
}
