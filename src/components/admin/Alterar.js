import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import * as firebase from 'firebase'


export default class Alterar extends React.Component {

    db = undefined

    constructor() {
        super()        

        this.handleChangeNome = this.handleChangeNome.bind(this)
        this.handleChangeCpf = this.handleChangeCpf.bind(this)
        this.handleChangeCodigo = this.handleChangeCodigo.bind(this)
        this.salvarCadastroAdministrador = this.salvarCadastroAdministrador.bind(this)

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
            nome  : undefined,
            cpf   : undefined,
            codigo      : undefined,
            id_usuario : undefined
        }
    }
    

    componentDidMount() {
        
        const { id } = this.props.match.params

        // Salvanado  id do usuario para utilizar quando for efetivar a alteração d banco de dados
        this.setState({ id_usuario: id })

        console.log("localizado: " + id)
           
        // Inicializando o Firebase
        // firebase.initializeApp(this.firebaseConfig)

        // Inicializando o banco de dados        
        this.db = firebase.database()

        // Consultando o cadastro do cliente 
        if (! this.state.nome ) {

            var cadastro_ref = this.db.ref("cadastro/" + id)
            
            cadastro_ref.once("value").then( (snapshot) => {
               
                snapshot.forEach(item => {    //Se por o return no forEach, se tiver valor e retornado true
                
                    var chave = item.key        //Variavel chave pega o nome do campo
                    var valor = item.val()      //Variavel valor pega o valor do campo

                    if(chave == "cpf")                         
                        this.setState({ cpf: valor })      
                    

                    if(chave == "nome") 
                        this.setState({ nome: valor }) 
                    

                    if(chave == "codigo")                        
                        this.setState({ codigo: valor }) 
                                
                }) 
    


            }).catch( (error) => {
                console.log("Erro ao consultar cadastro de administrador com ID")
                console.log(error)

            })
        }
        
    }


    salvarCadastroAdministrador(e) {  
        e.preventDefault()

        var codigo_perfil = this.refs.codigo.value

        //Tratamento de erro para editar o codigo de perfil
        if(codigo_perfil == "999" || codigo_perfil == "1" || codigo_perfil == "0"){

            var documento = {
                nome  : this.refs.nome.value,
                cpf   : this.refs.cpf.value,
                codigo: codigo_perfil
            }  
        
            
            //No administrador eh utilizado o "set" pois ele sobrescreve todas as informaçoes
            this.db.ref("cadastro/" + this.refs.id_cliente.value).set(documento).then( (result) => {  //insert
                console.log("Sucesso ao salvar o cadastro como administrador ")
                window.location = '/administrador'
            
            }).catch((error) => {
                console.log("Error ao salvar cadastro como administrador")
                console.log(error)
            
            })

        } else {
            console.log("Codigo invalido")
            window.location = '/administrador'
        }
       

    }


    handleChangeNome(event) {
        this.setState({nome: event.target.value});
    }


    handleChangeCpf(event) {
        this.setState({cpf: event.target.value});
    }
    

    handleChangeCodigo(event) {
        this.setState({codigo: event.target.value});
    }


    render(){
        const nome     = this.state.nome
        const cpf      = this.state.cpf
        const codigo   = this.state.codigo
        const id_usuario   = this.state.id_usuario
        

        return (
        
            <div>   
                <div className="container mt-4" >
                     
                    <h3 style={{textAlign: 'center'}} >Editar Cadastro</h3>

                    <div className="card mx-auto" style={{ width: '50%' }}>
                        <div className="card-body">
                            <form onSubmit={ this.salvarCadastroAdministrador }>
                                    <input type="text" ref="id_cliente" hidden="true" value={id_usuario} />

                                    <label for="nome">Nome</label>
                                    <input type="text" ref="nome" className="form-control" value={nome} onChange={this.handleChangeNome} />
                                    <br/>

                                    <label for="cpf">CPF</label>
                                    <input type="text" ref="cpf" className="form-control" value={cpf} onChange={this.handleChangeCpf} />
                                    <br/>

                                    <label for="codigo">Código Perfíl</label>
                                    <input type="text" ref="codigo" className="form-control" value={codigo} onChange={this.handleChangeCodigo} />

                                    <button type="submit" className="btn btn-success mt-4">Salvar</button>
                            </form>        
                        </div>
                    </div> 
                </div>              
            </div>         
    
        ) 
    }
} 