import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import * as firebase from 'firebase'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


function createData(id, codigo, cpf, nome) {
  return { id, codigo, cpf, nome };
}


const rows = []


const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});


export default class Admin extends React.Component {

    db = undefined

    constructor() {
        super()        

        this.DesativarCliente = this.DesativarCliente.bind(this)
        this.AtivarCliente = this.AtivarCliente.bind(this)

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
            dados: undefined
        }
    }


    componentDidMount() {
        // Inicializando o Firebase
        firebase.initializeApp(this.firebaseConfig)

        // Inicializando a Autenticacao
        this.db = firebase.database()

        //Consultando todos os usuarios cadastrados
        if ( rows.length == 0 ) {

            var cadastro_ref = this.db.ref("cadastro")
            
            cadastro_ref.once("value").then( (snapshot) => {      //Select
                
                snapshot.forEach(item => {    //Se por o return no forEach, se tiver valor e retornado true

                    var id     = item.key

                    var dados  = item.val()
                        var codigo =  dados.codigo
                        var cpf    =  dados.cpf
                        var nome   =  dados.nome

                    rows.push( createData(id, codigo, cpf, nome) )
                }) 
            
                // Comando para alterar o estado e renderizar  tabela, NAO APAGAR JAMAIS 
                this.setState({ 
                    dados: "ok"
                })
    

            }).catch( (error) => {
                console.log("Erro ao consultar cadastro de administrador")
                console.log(error)

            })
        }    
    }


    DesativarCliente(id, e) {
        e.preventDefault()

        
        var documento = {
            codigo: "0"
        }  
         
        // Desativando o usuario
        this.db.ref("cadastro/" + id).update(documento).then( (result) => {  //update
            console.log("Sucesso ao desativar usuario ")

            window.location = '/administrador'
         
        }).catch((error) => {
            console.log("Error ao desativar usuario")
            console.log(error)
            
        })
        
    }


    AtivarCliente(id, e) {
        e.preventDefault()

        
        var documento = {
            codigo: "1"
        }  
         
        // Ativando o usuario
        this.db.ref("cadastro/" + id).update(documento).then( (result) => {  //update
            console.log("Sucesso ao ativar usuario ")

            window.location = '/administrador'
         
        }).catch((error) => {
            console.log("Error ao ativar usuario")
            console.log(error)
            
        })
        
    }


    render(){        

        return (
        
            <div  className="container mt-4" > 
                <TableContainer component={Paper}>
                    <Table className="table-hover">
                        <TableHead >
                        <TableRow>
                            <TableCell scope="col">NOME</TableCell>
                            <TableCell scope="col">CPF</TableCell>
                            <TableCell scope="col">CODIGO_PERFIL</TableCell>
                        </TableRow>
                        </TableHead>

                        <TableBody>
                        {rows.map((row) => (
                            // <TableRow key={row.name}>
                            <TableRow >
                                <TableCell hidden="true">{row.id}</TableCell>
                                <TableCell scope="row">{row.nome}</TableCell>
                                <TableCell scope="row">{row.cpf}</TableCell>
                                <TableCell scope="row">{row.codigo}</TableCell>
                                <Link to={`/administrador/altera_cadastro/${row.id}`}><button className="btn btn-primary ml-4">Editar</button></Link>
                               
                                <button type="button" onClick={(e) => this.DesativarCliente(row.id, e)} className="btn btn-danger ml-4">Desativar</button>
                                <button type="button" onClick={(e) => this.AtivarCliente(row.id, e)} className="btn btn-success ml-4">Ativar</button>
                               
                                {/* <Link to="/cliente/altera_cliente"><button className="btn btn-danger mt-4 ml-4">Desativar</button></Link> */}
                            </TableRow> 
                        ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            </div>
        ) 
    }
}