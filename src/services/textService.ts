import nodemailer from 'nodemailer'
import { textNumber, gmailAppUsername, gmailAppPassword } from '../config/envVariables'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailAppUsername,
    pass: gmailAppPassword,
  },
})

export const sendEmailToNumber = async (subject: string, text: string, htm: string = null) => {
  try {
    const info = await transporter.sendMail({
      from: `"Visa Service Notifier" <${gmailAppUsername}>`, // sender address
      to: `${textNumber}@tmomail.net`, // list of receivers
      subject: `Visa Notifier - ${subject}`, // Subject line
      text: text, // plain text body
      //   html: `<b>There is a new article. It's about sending emails, check it out!</b>`, // html body doesn't work with text
    })

    console.log({ info })
  } catch (err) {
    console.error(err)
  }
}
