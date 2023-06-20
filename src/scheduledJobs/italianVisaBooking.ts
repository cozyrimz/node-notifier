import cron from 'node-cron'
import { chromium, Page } from 'playwright'
import { italianVisaURI, italianVisaUsername, italianVisaPassword } from '../config/envVariables'
import { sendEmailToNumber } from '../services/textService'

const DEFAULT_TIMEOUT_MILLIS = 10 * 60 * 1000
const count_per_session_for_booking_click = 30

// TRANSLATION: There are currently no dates available for the requested service
const NO_APPTS_AVAILABLE_TEXT = 'Al momento non ci sono date disponibili per il servizio richiesto'
const BOOKING_PAGE_HREF = '/Services'

let currPage: Page

async function loginToBookingSite(page: Page) {
  await page.locator('input#login-email').fill(italianVisaUsername)
  await page.locator('input#login-password').fill(italianVisaPassword)

  const signInButton = await page.locator('button:text("Avanti")')
  // click sign in button
  signInButton.click()

  await page.waitForNavigation({ waitUntil: 'networkidle' })

  return page
}

async function clickOn90DayBooking(page: Page): Promise<[Page, boolean]> {
  const success = false

  return [page, success]
}

async function goToVisaSite() {
  console.log('starting visa booking job')

  const browser = await chromium.launch({
    headless: false,
  })
  const context = await browser.newContext()
  context.setDefaultTimeout(DEFAULT_TIMEOUT_MILLIS)

  currPage = await browser.newPage()
  currPage.on('response', (response) => console.log('<<', response.status(), response.url()))

  try {
    await currPage.goto(italianVisaURI, { timeout: DEFAULT_TIMEOUT_MILLIS })
  } catch (err) {
    console.error('Error initial loading italian visa login page')
    console.error(err)
  }

  // wait for other things to load after first response body
  await currPage.waitForTimeout(5000)
  await loginToBookingSite(currPage)

  let success = false
  for (let i = 0; i < count_per_session_for_booking_click; i++) {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    const [_, successInternal] = await clickOn90DayBooking(currPage)

    if (successInternal) {
      success = successInternal
      sendEmailToNumber('Booking Check', 'Looks like some appointments are available! Please check')
      break
    }
  }

  if (!success) await browser.close()
}

export function runVisaBookingJob() {
  goToVisaSite()

  cron.schedule('0 * * * *', () => goToVisaSite())
}
