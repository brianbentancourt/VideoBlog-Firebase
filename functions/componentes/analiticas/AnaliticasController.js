const { SMSHelper } = require('./../utilidad/SMSHelper.js')
const functions = require('firebase-functions')

exports.enviarCuponCompartir = evento => {
  const redSocial = evento.params.method
  console.log(evento)
  const numCelular = functions.config().configuration.numcelularerror

  return SMSHelper(
      `Gracias por compartir en ${redSocial}, te ganaste un premio!`,
      numCelular
  ).catch(err => console.error(err))
}
