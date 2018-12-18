class Autenticacion {
  autEmailPass (email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then( result => {
      // pregunto si el usuario ya verifico su correo
      if(result.user.emailVerified){
        $('#avatar').attr('src', 'imagenes/usuario_auth.png')
        Materialize.toast(`Bienvenido ${result.user.displayName}`, 5000)
      }else{
        firebase.auth().signOut()
        Materialize.toast(`Por favor verifica tu correo electronico`, 5000)
      }
    })
    $('.modal').modal('close')
  }

  crearCuentaEmailPass (email, password, nombres) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(result => {
      result.user.updateProfile({
        displayname: nombres
      })

      const configuracion = {
        url: 'http://localhost:3000/'
      }

      result.user.sendEmailVerification(configuracion)
      .catch(err =>{
        console.log(err);
        Materialize.toast(err.message, 4000)})

      firebase.auth().signOut()

      Materialize.toast(
        `Bienvenido ${nombres}, debes realizar el proceso de verificación`,
        4000
      )

      $('.modal').modal('close')

    }).catch(err =>{
      console.log(err);
      Materialize.toast(err.message, 4000)})

    
  }

  authCuentaGoogle () {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
    .then(result =>{
      $('#avatar').attr('src', result.user.photoURL)
      Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
    })
    .catch( error => {
      console.error(error)
      Materialize.toast(`Error al autenticarse con Google ${error} `, 4000)
    })
    $('.modal').modal('close')
  }

  authCuentaFacebook () {
    const provider = new firebase.auth.FacebookAuthProvider()
    firebase.auth().signInWithPopup(provider)
    .then(result =>{
      $('#avatar').attr('src', result.user.photoURL)
      Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
    })
    .catch( error => {
      console.error(error)
      Materialize.toast(`Error al autenticarse con Facebook ${error} `, 4000)
    })
    $('.modal').modal('close')
  }

  authTwitter () {
    // TODO: Crear auth con twitter
  }

  error(err){
    console.error(error)
    Materualize.toast(error.message, 4000)
  }

}
