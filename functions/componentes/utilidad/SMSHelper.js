const Twilio = require('twilio')
const functions = require('firebase-functions')

exports.SMSHelper = (mensaje, numeroCelular) => {
  const SID = functions.config().configuration.accountsidtwilio
  const authToken = functions.config().configuration.authtokentwilio

  //console.log(`SID: ${SID}, authToken: ${authToken}`)

  const twilioCliente = new Twilio(SID, authToken)

  return twilioCliente.messages.create({
    to: numeroCelular,
    from: '+19106136402',
    body: mensaje
  })
}
