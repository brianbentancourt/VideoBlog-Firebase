const admin = require('firebase-admin')
const functions = require('firebase-functions')
const path = require('path')
const os = require('os')
const fs = require('fs')
const vision = require('@google-cloud/vision')
const { Email } = require('./../utilidad/EmailHelper.js')
const plantillas = require('./../utilidad/PlantillasEmail.js')
const { Notificaciones } = require('./../notificaciones/Notificaciones.js')

class Posts {
  registrarAuditoria (idPost, nuevoPost, viejoPost) {
    // Reto
  }

  validarImagenPost (archivo) {
    const rutaArchivo = archivo.name
    const nombreArchivo = path.basename(rutaArchivo)
    const idPost = path.basename(rutaArchivo).split('.')[0]
    const bucket = admin.storage.bucket()
    const tmpRutaArchivo = path.join(os.tmpdir(), nombreArchivo)

    const cliente = new vision.ImageAnnotatorClient()
    return bucket.file(rutaArchivo)
      .download({ destination: tmpRutaArchivo })
      .then(() => {
        return cliente.safeSearchDetection(tmpRutaArchivo)
      })
      .then(resultado => {
        const adulto = resultado[0].safeSearchAnnotation.adult
        const violenta = resultado[0].safeSearchAnnotation.violence
        const medico = resultado[0].safeSearchAnnotation.medical

        return (
          this.esAdecuada(adulto) &&
          this.esAdecuada(violenta) &&
          this.esAdecuada(medico)
        )
      })
      .then(resp => {
        if(resp){
          this.actualizarEstadoPost(idPost, true)
          return resp
        }
        return this.enviarNotRespImagenInapropiada(idPost)
      })
  }

  esAdecuada (resultado) {
    return (
      resultado !== 'POSSIBLE' &&
      resultado !== 'LIKELY' &&
      resultado !== 'VERY_LIKELY'
    )
  }

  actualizarEstadoPost (idPost, estado) {
    const refAuditoria = admin
      .firestore()
      .collection('posts')
      .doc(idPost)

    return refAuditoria.update({
      publicado: estado
    })
  }

  enviarNotRespImagenInapropiada (idPost) {
    console.log(`Consultar Token idPost => ${idPost}`)

    return admin
      .firestore()
      .collection('posts')
      .doc(idPost)
      .get()
      .then(post => {
        console.log(post)
        if (post.data().token !== null && post.data().token !== undefined) {
          console.log(`idPost token => ${post.data().token}`)
          const notificaciones = new Notificaciones()
          notificaciones.enviarNotificacionAToken(
            'Posts con imagen no permitida',
            'Tu post no se puede mostrar ya que la imagen no es permitida',
            'notvalidacionimagen',
            post.data().token
          )
        }

        return post
      })
  }

  enviarPostSemana (topicoNotificacion) {
    const fechaFin = new Date()
    let fechaInicial = new Date()
    fechaInicial.setDate(fechaFin.getDate() - 5)
    let emails = ''

    return admin  
      .firestore()
      .collection('emailsusuarios')
      .get()
      .then( emailsUsuarios => {
        emailsUsuarios.forEach(emailUsuario => {
          emails += `${emailUsuario.data().email},`
        })
        return emails
      })
      .then( () => {
        return admin
          .firestore()
          .collection('posts')
          .where('fecha', '>=', fechaInicial)
          .where('fecha', '<=', fechaFin)
          .where('publicado', '==', true)
          .get()
      })
      .then(posts => {
        if(!posts.empty){
          const txtHtml = plantillas.plantillaVideosLaSemana(posts)
          const objEmail = new Email()
          return objEmail.sendEmail(
            'info@blogeek.com',
            emails,
            '',
            'Video Blogeek - Videos de la semana',
            txtHtml
          )
        }
        return null
      })
  }
}

exports.Posts = Posts
