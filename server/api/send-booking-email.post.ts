import nodemailer from 'nodemailer'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as {
    name: string
    email: string
    date: string
    time: string
    location: string
    phone?: string
    notes?: string
  }

  const config = useRuntimeConfig()
  const emailConfig = config.nodemailerConfig

  // Map location values to friendly text
  const locationTextMap: Record<string, string> = {
    call: 'Telefonat',
    office: 'Vor Ort: Rhowerk GmbH, Karl-Heine-Straße 20, 04229 Leipzig',
    teams: 'Microsoft Teams'
  }

  const locationText = locationTextMap[body.location] || body.location
  const dateString = body.date || ''

  try {
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
      requireTLS: emailConfig.requireTLS,
      tls: { rejectUnauthorized: false }, // trust self-signed certificates
      connectionTimeout: emailConfig.connectionTimeout,
      greetingTimeout: emailConfig.greetingTimeout,
      socketTimeout: emailConfig.socketTimeout,
    })

    // Email to client
    await transporter.sendMail({
      from: `"Rholing" <${emailConfig.auth.user}>`,
      to: body.email,
      subject: 'Dein Termin wurde gebucht',
      text: `
Hallo ${body.name},

Du hast einen Termin gebucht:

Datum: ${dateString}
Uhrzeit: ${body.time}
Ort: ${locationText}
${body.phone ? `Telefon: ${body.phone}` : ''}
Notizen: ${body.notes || 'Keine'}

Vielen Dank!
      `
    })

    // Email to admin
    await transporter.sendMail({
      from: `"Rholing" <${emailConfig.auth.user}>`,
      to: emailConfig.emailTo,
      subject: `Neue Buchung von ${body.name}`,
      text: `
Neue Buchung:

Name: ${body.name}
Email: ${body.email}
Datum: ${dateString}
Uhrzeit: ${body.time}
Ort: ${locationText}
${body.phone ? `Telefon: ${body.phone}` : ''}
Notizen: ${body.notes || 'Keine'}
      `
    })

    return { success: true }
  } catch (err) {
    console.error(err)
    return { success: false, error: err }
  }
})
