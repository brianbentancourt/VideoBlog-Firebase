const test = require('firebase-functions-test')(
    {
        databaseURL: "https://blogplatzi-c1c10.firebaseio.com",
        projectId: "blogplatzi-c1c10",
        storageBucket: "blogplatzi-c1c10.appspot.com"
    },
    './test/credenciales.json'
)

test.mockConfig({
    "configuration": {
        "email": "brianbentancourt9@gmail.com",
        "password": "your_pass",
        "claveapihubspot": "your_claveapihubspot",
        "accountsidtwilio": "your_accountsidtwilio",
        "numcelularerror": "num_test",
        "authtokentwilio": "your_authtokentwilio"
      }
})

const funciones = require('../../index.js')

describe('funciones', () => {
    after( () => {
        test.cleanup()
    })

    describe('nuevoErrorAppTest', () => {
        it('SMS enviado correctamente', done => {
            const nuevoErrorWrap = test.wrap(funciones.nuevoErrorApp)
            const data = test.crashlytics.exampleIssue()
            nuevoErrorWrap(data)
                .then( () => {
                    return done()
                })
                .catch(err => done(err))
        })

    })

    describe('enviarNotificacionTest', () => {
        it('enviarNotificacion', done => {
            const enviarNotificacionWrap = test.wrap(funciones.enviarNotificacion)
            const dataAfter = test.firestore.makeDocumentSnapshot(
                {
                    publicado: true,
                    titulo: 'prueba unitaria',
                    descripcion: 'prueba unitaria'
                },
                ''
            )
            const dataBefore = test.firestore.makeDocumentSnapshot(
                {
                    publicado: false
                },
                ''
            )

            const cambios = test.makeChange(dataBefore, dataAfter)

            enviarNotificacionWrap(cambios)
                .then( () => {
                    return done()
                })
                .catch(err => done(err))

        })
    })
})
