import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import * as firebase from 'firebase'


export default class Alterar extends React.Component {

    usuario = undefined
    db = undefined

    constructor() {
        super()        

        this.handleChangeNome = this.handleChangeNome.bind(this)
        this.handleChangeCpf = this.handleChangeCpf.bind(this)
        this.salvarCadastroCliente = this.salvarCadastroCliente.bind(this)

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
            nome: undefined,
            cpf: undefined
        }
    }


    componentDidMount() {

        const { id } = this.props.match.params

        console.log("id localizado")
        console.log(id)

        // Inicializando o Firebase
        // firebase.initializeApp(this.firebaseConfig)

        // Inicializando a Autenticacao
        this.usuario = id
        // this.usuario = "4lWze0p5r9gosXnli97JYGjnQDg1"
        this.db = firebase.database()

        // Consultando o cadastro do cliente 
        if (! this.state.nome ) {

            const cadastro_ref = this.db.ref("cadastro/" + this.usuario)
            console.log("cadastro_ref")
            console.log(cadastro_ref)

            cadastro_ref.once("value").then( (snapshot) => {
            
                var lista_retorno = []   //Criando uma variavel auxiliar de retono dentro do .then pois fora ele não enxerga

                snapshot.forEach(item => {    //Se por o return no forEach, se tiver valor e retornado true
                var chave = item.key        //Variavel chave pega o nome do campo
                var valor = item.val()      //Variavel valor pega o valor do campo

                if(chave == "cpf") { 
                    var documento_cpf = {     //Documento cpf para pegar apenas o cpf 
                    cpf : valor
                    } 
                
                    lista_retorno.push(documento_cpf)        
                }

                if(chave == "nome") {        
                    var documento_nome = {          //Documento nome para pegar apenas o nome 
                    nome : valor
                    } 
                    
                    lista_retorno.push(documento_nome)
                }
                
                }) 
                
                this.setState({ 
                    cpf:    lista_retorno[0].cpf,
                    nome:   lista_retorno[1].nome
                })
                

            }).catch( (error) => {
                console.log("Erro ao consultar cadastro de cliente")
                console.log(error)

            })            
        }

    }


    salvarCadastroCliente(e) {  
        e.preventDefault()

        this.usuario = this.refs.id_cliente.value

        var documento = {
            nome  : this.refs.nome.value,
            cpf   : this.refs.cpf.value
        }  
        
        
        //No usuario eh utilizado o "update" pois ele sobrescreve apenas os campos alterados, não apagando o codigo
        this.db.ref("cadastro/" + this.usuario).update(documento).then( (result) => {
            console.log("Sucesso ao salvar o cadastro como usuario ")

            window.location = '/cliente/' + this.usuario
        
        }).catch((error) => {
            console.log("Error ao salvar cadastro como usuario ")
            console.log(error)
        
        })
    }


    handleChangeNome(event) {
        this.setState({nome: event.target.value});
    }
    

    handleChangeCpf(event) {
        this.setState({cpf: event.target.value});
    }


    render(){
        const nome  = this.state.nome
        const cpf   = this.state.cpf
        const id_usuario = this.usuario

        return (
        
            <div>   
                <div className="container mt-4" >
                     
                    <h3 style={{textAlign: 'center'}} >Editar Cadastro</h3>

                    <div className="card mx-auto" style={{width: "50%" }} >
                        <div className="card-body">
                            <form onSubmit={ this.salvarCadastroCliente }>

                            <input type="text" ref="id_cliente" hidden="true" value={id_usuario} />

                            <label for="nome">Nome</label>
                            <input type="text" ref="nome" className="form-control" value={nome} onChange={this.handleChangeNome} />
                            <br/>  

                            <label for="cpf">CPF</label>
                            <input type="text" ref="cpf" className="form-control" value={cpf} onChange={this.handleChangeCpf} />
                            <br/>        

                            <button type="submit" className="btn btn-success mt-4">Salvar</button>
                            </form>        
                        </div>
                    </div>
                </div>              
            </div>         
    
        ) 
    }
} 