import React from 'react'
import * as firebase from 'firebase'

export default class Navbar extends React.Component {

    constructor() {
        super()
        this.sair = this.sair.bind(this)    
        
        this.firebaseConfig = {
            apiKey: "AIzaSyAJJ08JjBtS8DM421hO-_BvGcLolu1AqtM",
            authDomain: "bandeira-assessoria.firebaseapp.com",
            databaseURL: "https://bandeira-assessoria.firebaseio.com",
            projectId: "bandeira-assessoria",
            storageBucket: "bandeira-assessoria.appspot.com",
            messagingSenderId: "853095263167",
            appId: "1:853095263167:web:a7b9d2cc70d29ed4330f0a"
        }
    }

    sair(e){        
        e.preventDefault()

        // firebase.initializeApp(this.firebaseConfig)

        firebase.auth().signOut().then( (result) => {
            console.log("Logout com sucesso")

            window.location = '/login'

          }).catch((error) => {
            console.log("Error ao sair com o usuario ")
            console.log(error)
          
          })
    }


    render(){
        return (<div>
            <nav className="navbar navbar-dark bg-primary">
                <a className="navbar-brand" >
                    Bandeira
                </a>

                <form className="form-inline my-2 my-lg-0" onSubmit={this.sair}>
                    <button className="btn btn-danger  my-2 my-sm-0" type="submit">Sair</button>
                </form>
            </nav>
        </div>);
    }
}