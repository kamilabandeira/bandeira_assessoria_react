import React from 'react';
import * as firebase from 'firebase'

export default class Criar_Conta extends React.Component {

    auth = undefined
    db = undefined


    constructor() {
        super()
        this.criar_conta = this.criar_conta.bind(this)

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
    

    componentDidMount() {
        // Inicializando o Firebase
        firebase.initializeApp(this.firebaseConfig)

        // Inicializando a Autenticacao
        this.auth = firebase.auth()
        this.db = firebase.database()

    }


    criar_conta(e) {
        e.preventDefault()
        console.log('criar_conta')

        var email = this.refs.email.value
        var senha = this.refs.senha.value

        this.auth.createUserWithEmailAndPassword(email, senha).then( (sucesso) => {
            console.log("criado com suceso" + sucesso)

            // Cadastrando os dados no novo usuario
            var usuario = sucesso.user.uid 

            var documento = {
                nome  : this.refs.nome.value,
                cpf   : this.refs.cpf.value,
                codigo: "1"
            }  
            
            // Chamada do banco de dados para cadastrar o novo usuario
            this.db.ref("cadastro/" + usuario).set(documento).then( (result) => {
                console.log("Sucesso ao cadastrar novo usuario ")
            
                window.location = '/cliente/' + usuario

            }).catch((error) => {
                console.log("Error ao cadastrar novo usuario ")
                console.log(error)            
            })
            


            
        }).catch( (error) => {
            console.log("Erro ao criar usuario ")
            console.log(error)       
        })
    }


    render(){
        return (
        
            <div>   
                <div className="container mt-4"> 
                    <div className="card mx-auto" style={{ width: '50%' }}>
                        <div className="card-body">

                        <form className="px-4 py-3" onSubmit={ this.criar_conta }>
                            <div className="form-group">
                            <label >Email</label>
                            <input type="email" className="form-control" ref="email" placeholder="email@exemplo.com" />
                            </div>

                            <div className="form-group">
                            <label >Senha</label>
                            <input type="password" className="form-control" ref="senha" placeholder="Senha" />
                            </div>

                            <div className="form-group">
                            <label >Nome</label>
                            <input type="text" className="form-control" ref="nome" placeholder="Digite seu nome" />
                            </div>

                            <div className="form-group">
                            <label >CPF</label>
                            <input type="text" className="form-control" ref="cpf" placeholder="Digite seu CPF" />
                            </div>

                            <button type="submit" className="btn btn-success">Salvar</button>
                        </form>      
                        </div>
                    </div>

                </div>             
            </div>         
    
        ) 
    }
}