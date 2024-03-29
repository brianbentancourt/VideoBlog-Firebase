const { Notificaciones } = require('./../notificaciones/Notificaciones.js')
const { Posts } = require('./Posts.js')

exports.actualizacionPostController = (dataSnapshot, context) => {
  const notificaciones = new Notificaciones()
  if(dataSnapshot.before.data().publicado === false && dataSnapshot.after.data().publicado === true){
    return notificaciones.enviarNotificacion(
      dataSnapshot.after.data().titulo,
      dataSnapshot.after.data().descipcion,
      null,
      ""
    )
  }
}

exports.auditoriaPostController = (dataSnapshot, context) => {
  // Reto: video 8
}

exports.validarImagenPostController = imagen => {
  
  if(!imagen.name.match('/imgPosts/'))
    return null

  if(!imagen.contentType.startsWith('image/')){
    console.error('El archivo no es una imagen')
    return null
  }

  const posts = new Posts()
  return posts.validarImagenPost(imagen)
  .catch(error => console.error(error))
}

exports.enviarPostsSemana = topico => {
  const post = new Posts()
  return post.enviarPostSemana(topico)
}
