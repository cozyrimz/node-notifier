if (process.env.NODE_ENV === 'local') console.log(process.env)
export const mongoURI = process.env.MONGO_URI

// squash rx
export const squashRxURI = 'https://squashrx.advantagebooking.com/'
export const squashRxUsername = process.env.SQUASH_RX_USERNAME
export const squashRxPassword = process.env.SQUASH_RX_PASSWORD

// visa booking
export const italianVisaURI = 'https://prenotami.esteri.it/Home?ReturnUrl=%2fServices'
export const italianVisaUsername = process.env.ITALIAN_VISA_USERNAME
export const italianVisaPassword = process.env.ITALIAN_VISA_PASSWORD

// text and email stuff
export const textNumber = process.env.TEXT_NUMBER || '7738447506'
export const gmailAppUsername = process.env.GMAIL_APP_USERNAME
export const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
