importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-messaging.js')

firebase.initializeApp({
    projectId: "blogplatzi-c1c10",
    messagingSenderId: "94461732256"
})

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(payload =>{
    const titulo = 'Nuevo post!'
    const opciones = {
        body: payload.data.titulo,
        icon: 'icons/icon_new_post.png',
        click_action: 'https://blogplatzi-c1c10.firebaseapp.com/'
    }
    return self.registration.showNotification(
        titulo,
        opcioness
    )
})



