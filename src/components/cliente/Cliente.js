import React from 'react'
import { Link } from 'react-router-dom'
import * as firebase from 'firebase'


export default class Cliente extends React.Component {

    usuario = undefined
    db = undefined

    constructor() {
        super()        

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

        // Inicializando o Firebase
        firebase.initializeApp(this.firebaseConfig)

        // Inicializando a Autenticacao
        this.usuario = id
        this.db = firebase.database()

        // Consultando o cadastro do cliente 
        if (! this.state.nome ) {

            const cadastro_ref = this.db.ref("cadastro/" + this.usuario)

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
    

    render(){
        const nome  = this.state.nome
        const cpf   = this.state.cpf

        return (

                <div>   
                    <div className="container mt-4" >
                        
                        <h3 style={{textAlign: 'center'}} >Cadastro</h3>

                        <div className="card mx-auto" style={{width: "50%" }} >
                            <div className="card-body">
                                <form>

                                <label>Nome</label>
                                <input type="text" className="form-control" value={nome} />
                                <br/>  

                                <label >CPF</label>
                                <input type="text" className="form-control" value={cpf}  />
                                <br/>        

                                {/* <Link to="/cliente/altera_cliente"><button className="btn btn-primary mt-4">Editar</button></Link> */}
                                <Link to={`/cliente/altera_cliente/${this.usuario}`}><button className="btn btn-primary mt-4">Editar</button></Link>
                                </form>        
                            </div>
                        </div>
                    </div>              
                </div>
        ) 
    }
} 