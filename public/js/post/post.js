class Post {
    constructor() {
        this.db = firebase.firestore()
        // estas configuraciones son para convertir datetime a timestamp 
        const settings = { 'timestampsInSnapshots': true }
        this.db.settings(settings)

    }

    crearPost(uid, emailUser, titulo, descripcion, imagenLink, videoLink) {
        // this.db.collection('post').doc('key').set({})
        return this.db.collection('post').add({
            uid,
            autor: emailUser,
            titulo,
            descripcion,
            imagenLink,
            videoLink,
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        })
            .then(refDoc => {
                console.log(`Post ID: ${refDoc.id}`)
            })
            .catch(error => console.error(error))
    }

    consultarTodosPost() {
        this.db.collection('post')
        .orderBy('fecha', 'asc')
        .orderBy('titulo', 'asc')
        .onSnapshot(querySnapshot => {
            $('#posts').empty()
            if (querySnapshot.empty) {
                $('#posts').append(this.obtenerTemplatePostVacio())
            } else {
                querySnapshot.forEach(post => {
                    let postHtml = this.obtenerPostTemplate(
                        post.data().autor,
                        post.data().titulo,
                        post.data().descripcion,
                        post.data().videoLink,
                        post.data().imagenLink,
                        Utilidad.obtenerFecha(post.data().fecha.toDate())
                    )
                    $('#posts').append(postHtml)
                })
            }
        })
    }

    consultarPostxUsuario(emailUser) {
        this.db.collection('post')
        .orderBy('fecha', 'asc')
        .orderBy('titulo', 'asc')
        .where('autor', '==', emailUser)
        .onSnapshot(querySnapshot => {
            $('#posts').empty()
            if (querySnapshot.empty) {
                $('#posts').append(this.obtenerTemplatePostVacio())
            } else {
                querySnapshot.forEach(post => {
                    let postHtml = this.obtenerPostTemplate(
                        post.data().autor,
                        post.data().titulo,
                        post.data().descripcion,
                        post.data().videoLink,
                        post.data().imagenLink,
                        Utilidad.obtenerFecha(post.data().fecha.toDate())
                    )
                    $('#posts').append(postHtml)
                })
            }
        })
    }

    subirImagenPost(file, uid){
        const refStorage = firebase.storage().ref(`imgPosts/${uid}/${file.name}`)
        const task = refStorage.put(file)
        task.on('state_changed',
        snapshot =>{
            const porcentaje = snapshot.bytesTransferred / snapshot.totalBytes *100
            $('.determinate').attr('style', `width: ${porcentaje}%`)
        },
        err =>{
             Materialize.toast(err.message,4000)
        },
        () =>{
            task.snapshot.ref
            .getDownloadURL()
            .then(ur =>{
                console.log(url)
                sessionStorage.setItem('imgNewPost', getDownloadURL)
            })
            .catch(err => Materialize.toast(err.message,4000))
        })
    }

    obtenerTemplatePostVacio() {
        return `<article class="post">
      <div class="post-titulo">
          <h5>Crea el primer Post a la comunidad</h5>
      </div>
      <div class="post-calificacion">
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
      </div>
      <div class="post-video">
          <iframe type="text/html" width="500" height="385" src='https://www.youtube.com/embed/bTSWzddyL7E?ecver=2'
              frameborder="0"></iframe>
          </figure>
      </div>
      <div class="post-videolink">
          Video
      </div>
      <div class="post-descripcion">
          <p>Crea el primer Post a la comunidad</p>
      </div>
      <div class="post-footer container">         
      </div>
  </article>`
    }

    obtenerPostTemplate(
        autor,
        titulo,
        descripcion,
        videoLink,
        imagenLink,
        fecha
    ) {
        if (imagenLink) {
            return `<article class="post">
            <div class="post-titulo">
                <h5>${titulo}</h5>
            </div>
            <div class="post-calificacion">
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-vacia" href="*"></a>
            </div>
            <div class="post-video">                
                <img id="imgVideo" src='${imagenLink}' class="post-imagen-video" 
                    alt="Imagen Video">     
            </div>
            <div class="post-videolink">
                <a href="${videoLink}" target="blank">Ver Video</a>                            
            </div>
            <div class="post-descripcion">
                <p>${descripcion}</p>
            </div>
            <div class="post-footer container">
                <div class="row">
                    <div class="col m6">
                        Fecha: ${fecha}
                    </div>
                    <div class="col m6">
                        Autor: ${autor}
                    </div>        
                </div>
            </div>
        </article>`
        }

        return `<article class="post">
                <div class="post-titulo">
                    <h5>${titulo}</h5>
                </div>
                <div class="post-calificacion">
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-vacia" href="*"></a>
                </div>
                <div class="post-video">
                    <iframe type="text/html" width="500" height="385" src='${videoLink}'
                        frameborder="0"></iframe>
                    </figure>
                </div>
                <div class="post-videolink">
                    Video
                </div>
                <div class="post-descripcion">
                    <p>${descripcion}</p>
                </div>
                <div class="post-footer container">
                    <div class="row">
                        <div class="col m6">
                            Fecha: ${fecha}
                        </div>
                        <div class="col m6">
                            Autor: ${autor}
                        </div>        
                    </div>
                </div>
            </article>`
    }
}
