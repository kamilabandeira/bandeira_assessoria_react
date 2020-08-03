import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { ehAdministrador, ehCliente } from './auth'

import Login from './components/auth/Login'
import Criar_Conta from './components/auth/Criar_Conta'

import Admin from './components/admin/Admin'
import Alterar_Admin from './components/admin/Alterar'

import Cliente from './components/cliente/Cliente'
import Alterar_Cliente from './components/cliente/Alterar'


const PrivateRouteAdm = ({ component: Component, ...rest }) => (
    <Route 
        {...rest}
        render={ props =>

            // Se o usuario eh um administrador
            ehAdministrador() ? (
                <Component {...props} />
            ) : ( // se nao eh um cliente
                <Redirect to="/login" />
            )
        }
    />        
)


const PrivateRouteCliente = ({ component: Component, ...rest }) => (
    <Route 
        {...rest}
        render={ props =>

            // Se o usuario eh um administrador
            ehCliente() ? (
                <Component {...props} />
            ) : ( // se nao eh um cliente
                <Redirect to="/login" />
            )
        }
    />        
)


const Routes = () => (
    <BrowserRouter> 
        <Switch>
            {/* Rotas para Autenticação */}
            <Route exact path="/login" component={() => <Login />} />
            <Route exact path="/criar_conta" component={() => <Criar_Conta />} />

            {/* Rotas para Administrador */}
            {/* <Route exact path="/administrador" component={() => <Admin />} /> */}
            <PrivateRouteAdm exact path="/administrador" component={() => <Admin />} />
            <Route exact path="/administrador/altera_cadastro/:id" render={(props) => <Alterar_Admin {...props} />} />
            
            {/* Rotas para Clientes */}
            {/* <Route exact path="/cliente" component={() => <Cliente />} /> */}
            {/* <PrivateRouteCliente exact path="/cliente" component={() => <Cliente />} /> */}
            <Route exact path="/cliente/:id" render={(props) => <Cliente {...props} />} />
            {/* <Route exact path="/cliente/altera_cliente" component={() => <Alterar_Cliente />} />    */}
            <Route exact path="/cliente/altera_cliente/:id" render={(props) => <Alterar_Cliente {...props} />} />  

        </Switch>
    </BrowserRouter>
)

export default Routes