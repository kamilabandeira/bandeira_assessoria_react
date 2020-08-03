import React from 'react';
import * as firebase from 'firebase'

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'


export default class Login extends React.Component {

    auth = undefined
    db = undefined

    constructor() {
        super()
        this.authenticate = this.authenticate.bind(this)

        this.firebaseConfig = {
            apiKey: "AIzaSyAJJ08JjBtS8DM421hO-_BvGcLolu1AqtM",
            authDomain: "bandeira-assessoria.firebaseapp.com",
            databaseURL: "https://bandeira-assessoria.firebaseio.com",
            projectId: "bandeira-assessoria",
            storageBucket: "bandeira-assessoria.appspot.com",
            messagingSenderId: "853095263167",
            appId: "1:853095263167:web:a7b9d2cc70d29ed4330f0a"
          }

        this.state = {
            user: undefined
        }
    }


    componentDidMount() {
        // Inicializando o Firebase
        firebase.initializeApp(this.firebaseConfig)

        // Inicializando a Autenticacao
        this.auth = firebase.auth()
        this.db = firebase.database()

        this.auth.onAuthStateChanged((usuario_logado) => {

            if (usuario_logado) {
                // Se o usuario esta logado, salva as informacoes da sessao dele na classe.
                this.setState({
                    user: usuario_logado
                }) 

                // Salvando do Browser as informacoes do usuario
                localStorage.setItem('firebase_auth', this.state.use)
            } else {
                // Usuario deslogou
                this.setState({
                    user: undefined
                })

                // Removendo as informacoes do Browser
                localStorage.removeItem('firebase_auth')
            }
        })
    }


    authenticate(e) {
        e.preventDefault()
        console.log('authenticate')

        var email = this.refs.email.value
        var senha = this.refs.senha.value

        return this.auth.signInWithEmailAndPassword(email, senha).then(usuario_logado =>{

            var usuario = usuario_logado.user.uid

            var cadastro_ref = this.db.ref("cadastro/" + usuario)
            
            return cadastro_ref.once("value").then( (snapshot) => {
                var codigo_perfil = 0   //Criando uma variavel auxiliar de retono dentro do .then pois fora ele não enxerga

                snapshot.forEach(item => {    //Se por o return no forEach, se tiver valor e retornado true
                    
                    if(item.key == "codigo") {
                        codigo_perfil = item.val()     //Colocando o valor do codigo na minha auxiliar de retorno
                    }         
                }) 

                if (codigo_perfil == "999"){
                    console.log("Administrador encontrado")
                    window.location = '/administrador'
                    
                }else if(codigo_perfil == "1") {                    
                    console.log("Cliente encontrado")
                    window.location = '/cliente/' + usuario

                } else{             
                    console.log("Usuario com acesso negado")
                    window.location = '/login'
                }

            }).catch( (error) => {
                console.log("Erro ao consultar codigo")
                console.log(error)

            })


        }).catch( (error) => {
            console.log("Erro ao Logar")
            console.log(error)       
            window.location = '/login'
        })
    }


    render(){
        return (
        
            <div>   
                <div className="container mt-4"> 
                    <div className="card mx-auto" style={{ width: '50%' }} >
                        <div className="card-body">

                        <form className="px-4 py-3" onSubmit={ this.authenticate }>
                            <div className="form-group">
                            <label for="email">Email</label>
                            <input type="email" className="form-control" ref="email" placeholder="email@exemplo.com" />
                            </div>

                            <div className="form-group">
                            <label for="senha">Senha</label>
                            <input type="password" className="form-control" ref="senha" placeholder="Senha" />
                            </div>
                            
                            <button type="submit" className="btn btn-primary">Entrar</button>
                        </form>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="/criar_conta">Criar conta</a>

                        </div>
                    </div>  
                </div>             
            </div>         
    
        ) 
    }
}