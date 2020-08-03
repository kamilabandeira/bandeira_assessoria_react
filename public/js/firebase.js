const firebase = require("firebase")
require('firebase/storage')  //Importando o modulo storage para salvar as imagens 

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAJJ08JjBtS8DM421hO-_BvGcLolu1AqtM",
  authDomain: "bandeira-assessoria.firebaseapp.com",
  databaseURL: "https://bandeira-assessoria.firebaseio.com",
  projectId: "bandeira-assessoria",
  storageBucket: "bandeira-assessoria.appspot.com",
  messagingSenderId: "853095263167",
  appId: "1:853095263167:web:a7b9d2cc70d29ed4330f0a"
};
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const storage_img = firebase.app().storage("gs://bandeira-assessoria.appspot.com")


//Cria usuario
async function criarUsuario(email, senha) {

  return await firebase.auth().createUserWithEmailAndPassword(email, senha).then( (user) => {
    console.log("Usuário criado com sucesso. Clique em ENTRAR. ")
    
    return true

  }).catch( (error) => {
    console.log("Erro ao criar usuario")
    console.log(error)
     
    return false
  })
  
}

//Login
async function login(email, senha) {

  return await firebase.auth().signInWithEmailAndPassword(email, senha).then( (user) => {

    console.log("Bem vindo.")
   
    return true

  }).catch( (error) => {
    console.log("Erro ao Logar")
    console.log(error)

    return false
  })
  
} 


//Sair
async function sair() {  
  
  return await firebase.auth().signOut().then( (result) => {
    return true
  }).catch((error) => {
    console.log("Error ao sair com o usuario ")
    console.log(error)
  
    return false
  })
}



//Desativar Usuario
async function desativarUsuario(id_cliente) {  
  
  var documento = {
   codigo: "0"
  }  

//Estou usando await pois o firebase eh assincrono
//No administrador eh utilizado o "set" pois ele sobrescreve todas as informaçoes
return await firebase.database().ref("cadastro/" + id_cliente).update(documento).then( (result) => {  //update
  console.log("Sucesso ao desativar usuario ")

  return true

}).catch((error) => {
  console.log("Error ao desativar usuario")
  console.log(error)

  return false

})
}


//Salvar Cadastro Administrador
async function salvarCadastroAdministrador(id_cliente, nome_entrada, cpf_entrada, codigo_entrada) {  
  
    var documento = {
    nome  : nome_entrada,
    cpf   : cpf_entrada,
    codigo: codigo_entrada
    }  
  
  //Estou usando await pois o firebase eh assincrono
  //No administrador eh utilizado o "set" pois ele sobrescreve todas as informaçoes
  return await firebase.database().ref("cadastro/" + id_cliente).set(documento).then( (result) => {  //insert
    console.log("Sucesso ao salvar o cadastro como administrador ")

    return true
 
  }).catch((error) => {
    console.log("Error ao salvar cadastro como administrador")
    console.log(error)

    return false
  
  })
}

//Salvar Cadastro Cliente
async function salvarCadastroCliente(nome_entrada, cpf_entrada) {  
  
  var usuario = firebase.auth().currentUser.uid

  var documento = {
    nome  : nome_entrada,
    cpf   : cpf_entrada
  }  
  
  //Estou usando await pois o firebase eh assincrono
  //No usuario eh utilizado o "update" pois ele sobrescreve apenas os campos alterados, não apagando o codigo
  await firebase.database().ref("cadastro/" + usuario).update(documento).then( (result) => {
    console.log("Sucesso ao salvar o cadastro como usuario ")
 
  }).catch((error) => {
    console.log("Error ao salvar cadastro como usuario ")
    console.log(error)
  
  })
}

//Criar Cadastro Cliente
async function criarCadastroCliente(nome_entrada, cpf_entrada) {  
  
  var usuario = firebase.auth().currentUser.uid

  var documento = {
    nome  : nome_entrada,
    cpf   : cpf_entrada,
    codigo: "1"
  }  
  
  //Estou usando await pois o firebase eh assincrono
  //No usuario eh utilizado o "update" pois ele sobrescreve apenas os campos alterados, não apagando o codigo
  return await firebase.database().ref("cadastro/" + usuario).set(documento).then( (result) => {
    console.log("Sucesso ao criar novo usuario ")
 
    return true

  }).catch((error) => {
    console.log("Error ao criar novo usuario ")
    console.log(error)
  
    return false

  })
}


//Salvar Imagem
function salvarImagem() {  
  var usuario = "qd6wEXi1jSZ5dCqvnAvSFgoHOh6"
  // var usuario = firebase.auth().currentUser.uid
  
  // const file = document.querySelector("#foto").files[0]

  // console.log(file)

  var ler = new FileReader()
  var blob = new Blob()

  //Estou usando await pois o firebase eh assincrono
  //No usuario eh utilizado o "update" pois ele sobrescreve apenas os campos alterados, não apagando o codigo
  
  storage_img.ref(usuario).put("Capturar.PNG").then( (result) => {
    console.log("Sucesso ao salvar a imagem do usuario " + result)
 
  }).catch((error) => {
    console.log("Error ao salvar a imagem do usuario ")
    console.log(error)
  
  })
}
// salvarImagem()

//Consultar Codigo
async function consultarCodigo() { 
  var usuario = firebase.auth().currentUser.uid

  var cadastro_ref = firebase.database().ref("cadastro/" + usuario)
  
  return await cadastro_ref.once("value").then( (snapshot) => {
    var retorno = 0   //Criando uma variavel auxiliar de retono dentro do .then pois fora ele não enxerga

    snapshot.forEach(item => {    //Se por o return no forEach, se tiver valor e retornado true
         
      if(item.key == "codigo") {
        retorno = item.val()     //Colocando o valor do codigo na minha auxiliar de retorno
      }         
    }) 

    return retorno           //Retornando o valor do codigo

  }).catch( (error) => {
    console.log("Erro ao consultar codigo")
    console.log(error)

  })
}


//Consultar Cadastro Administrador
async function consultarCadastroAdmin() {

  var cadastro_ref = firebase.database().ref("cadastro")
  
  return await cadastro_ref.once("value").then( (snapshot) => {      //Select
    
    var lista_retorno = []   //Criando uma variavel auxiliar de retono dentro do .then pois fora ele não enxerga

    snapshot.forEach(item => {    //Se por o return no forEach, se tiver valor e retornado true
      
      var documento = {
        id    : item.key,
        dados : item.val()
      } 

      lista_retorno.push(documento)
    }) 
    
    return lista_retorno           

  }).catch( (error) => {
    console.log("Erro ao consultar cadastro de administrador")
    console.log(error)

  })
}

//Consultar Cadastro Administrador ID
async function consultarCadastroAdminId(id_usuario) {

  var cadastro_ref = firebase.database().ref("cadastro/" + id_usuario)
  
  return await cadastro_ref.once("value").then( (snapshot) => {
    
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

      if(chave == "codigo") {        
        var documento_codigo = {          //Documento codigo para pegar apenas o codigo 
          codigo : valor
        } 
        
        lista_retorno.push(documento_codigo)
      }
     
    }) 
      
    return lista_retorno           

  }).catch( (error) => {
    console.log("Erro ao consultar cadastro de administrador com ID")
    console.log(error)

  })
}


//Consultar Cadastro Cliente
async function consultarCadastroCliente() {

  var usuario = firebase.auth().currentUser.uid

  var cadastro_ref = firebase.database().ref("cadastro/" + usuario)
  
  return await cadastro_ref.once("value").then( (snapshot) => {
    
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
    
    return lista_retorno           

  }).catch( (error) => {
    console.log("Erro ao consultar cadastro de cliente")
    console.log(error)

  })
}


module.exports = {
  criarUsuario                : criarUsuario               ,
  login                       : login                      ,
  consultarCodigo             : consultarCodigo            ,
  consultarCadastroAdmin      : consultarCadastroAdmin     ,
  consultarCadastroCliente    : consultarCadastroCliente   ,
  consultarCadastroAdminId    : consultarCadastroAdminId   ,
  salvarCadastroAdministrador : salvarCadastroAdministrador,
  salvarCadastroCliente       : salvarCadastroCliente      ,
  criarCadastroCliente        : criarCadastroCliente       ,
  desativarUsuario            : desativarUsuario           ,
  sair                        : sair
}