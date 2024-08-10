import path from 'path'
import Email from 'email-templates'
import nodemailer from 'nodemailer'

class EmailSender {
  constructor({ user, pass }) {
    this.transporter = nodemailer.createTransport({
      pool: false,
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user,
        pass,
      },
    })
  }

  async verifyConnection() {
    try {
      await this.transporter.verify()
      console.log('Server is ready to take our messages')
    } catch (error) {
      console.log(error)
    }
  }

  close() {
    this.transporter.close()
  }

  async sendRealStateUpdateEmail({ toEmail, newItems, removedItems }) {
    const email = new Email({
      message: {
        from: toEmail,
      },
      send: true,
      transport: this.transporter,
      preview: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.resolve('emails/css'),
        },
      },
    })
    try {
      return await email.send({
        template: 'realStateNotification',
        message: {
          to: toEmail,
        },
        locals: {
          newItems,
          removedItems,
        },
      })
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
export default EmailSender
