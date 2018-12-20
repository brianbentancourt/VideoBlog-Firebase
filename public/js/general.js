$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  // Init Firebase nuevamente
  firebase.initializeApp(config);


  // Adicionar el service worker
  navigator.serviceWorker
    .register('notificaciones-sw.js')
    .then(registro => {
      console.log('service worker registrado')
      firebase.messaging().useServiceWorker(registro)
    })
    .catch(error => {
      console.error(`Error sal registrar el service worker => ${error}`)
    })
  //  Registrar LLave publica de messaging
  const messaging = firebase.messaging()
  messaging.usePublicVapidKey(
    'BIYE_jrIGhcxGyBSq7ytC_06W1g0s3UOYgmKrjSWfeyWR7ZETY40dbMeWn5ODVzpvAWOovdPdYvnzlxunnP1pTg'
  )

  // Solicitar permisos para las notificaciones
  messaging
    .requestPermission()
    .then(() => {
      console.log('permiso otorgado')
      return messaging.getToken()
    })
    .then(token => {
      console.log('token')
      console.log(token)
      const db = firebase.firestore()
      db.settings({ timestampsInSnapshots: true })
      db
        .collection('tokens')
        .doc(token)
        .set({
          token: token
        })
        .catch(error => {
          console.error(`Error al insertar el token en la BD => ${error}`)
        })
    })
    .catch(error => {
      console.error(`Permiso no otorgado => ${error}`)
    })

  // Obtener el token cuando se refresca
  messaging.onTokenRefresh(() => {
    messaging.getToken()
      .then(then => {
        console.log('token se ha renovado')
        const db = firebase.firestore()
        db.settings({ 'timestampsInSnapshot': true })
        db.collection('tokens').doc(token).set({
          token
        }).catch(err => console.error(`Error insertando token en DB: ${err}`))
      })
  })

  // Recibir las notificaciones cuando el usuario esta foreground
  messaging.onMessage(payload => {
    Materialize.toast(payload.data.titulo, 6000)
  })

  // Recibir las notificaciones cuando el usuario esta background


  // Listening real time
  const post = new Post()
  post.consultarTodosPost()

  //Firebase observador del cambio de estado
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $('#btnInicioSesion').text('Salir')
      if (user.photoURL) {
        $('#avatar').attr('src', user.photoURL)
      } else {
        $('#avatar').attr('src', 'imagenes/usuario_auth.png')
      }
    } else {
      $('#btnInicioSesion').text('Iniciar Sesión')
      $('#avatar').attr('src', 'imagenes/usuario.png')
    }
  })


  // TODO: Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {
    const user = firebase.auth().currentUser
    if (user) {
      $('#btnInicioSesion').text('Iniciar Sesión')
      return firebase.auth().signOut().then(() => {
        $('#avatar').attr('src', 'imagenes/usuario.png')
        Materialize.toast(`signOut correcto`, 4000)
      }).catch(error => {
        Materialize.toast(`Error al realizar SignOut: ${error}`, 4000)
      })
    }

    $('#emailSesion').val('')
    $('#passwordSesion').val('')
    $('#modalSesion').modal('open')
  })

  $('#avatar').click(() => {
    firebase.auth().signOut()
      .then(() => {
        $('#avatar').attr('src', 'imagenes/usuario.png')
        Materialize.toast(`SignOut correcto`, 4000)
      })
      .catch(error => {
        Materialize.toast(`Error al realizar SignOut: ${error}`, 4000)
      })
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad')
    const post = new Post()
    post.consultarTodosPost()
  })

  $('#btnMisPost').click(() => {
    const user = firebase.auth().currentUser
    if (!user) {
      Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000)
      return
    }

    $('#tituloPost').text('Mis Posts')
    const post = new Post()
    post.consultarPostxUsuario(user.email)

  })
})
