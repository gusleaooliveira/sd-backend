require('dotenv-safe').config();
const express = require('express'); // importa o express
const path = require('path'); // importa para utilizar os caminhos
const Mensagem = require('./model/mensagens/');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => {
    console.log("Banco de dados conectado!");
})
.catch(erro => {
    console.log("Erro ao conectar no banco!");
    console.log(erro);
});

mongoose.Promise = global.Promise;

const app = express(); // Inicializa o app
const server = require('http').createServer(app); // criando o servidor
const io = require('socket.io')(server, {
    cors: {
        origins: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
 }); // importando e utilizando o socketio no servidor

app.use(express.static(path.join(__dirname, 'public')));  //utilizando a pasta public para abrir arquivos html
app.set('views', path.join(__dirname, 'public'));// declarando que public será utilizado como views
app.engine('html', require('ejs').renderFile);//utilizar como renderizador o ejs
app.set('view engine', 'html');// utilizando o ejs e a engine criada anteriormente

// ao acessar / renderiza o index.html
app.use('/', (req, res)=>{
    res.render('index.html');
});


io.on('connection', socket => {
    Mensagem.find({}, (erro, valor) => {
        if(erro) console.log(erro);
        socket.emit('previousMessages', valor);
    });

    socket.on('sendMessage', data => {
        let msg =  new Mensagem(data);
        msg.save((erro, valor) => {
            if(erro) console.log(erro);
            socket.broadcast.emit('recivedMessage', valor);
        });
    });

});

//// Lista de mensagens
//let mensagens = [];
//
//// socket io ao conectar
//io.on('connection', socket => {
//    console.log('###############################'); // LOG do servidor
//    console.log(`Usuário conectado: ${socket.id}`); // LOG do servidor
//    console.log('Mensagens anteriores: ', mensagens); // LOG do servidor
//    socket.emit('previousMessages', mensagens); // enviando mensagens salvas no servidor
//    console.log('Enviando mensagens salvas!'); // LOG do servidor
//
//    socket.on('sendMessage', data => {
//        console.log(`\tUsuário: ${data.usuario}`); // LOG do servidor
//        console.log(`\tMensagem recebida: "${data.mensagem}"`);// LOG do servidor
//        mensagens.push(data); // salvando as mensagens
//        socket.broadcast.emit('recivedMessage', data); // enviando mensagem para todos os cliente
//        console.log('\tMensagem enviada para todos os clients!');// LOG do servidor
//    })
//
//    socket.on('disconnect', function(){
//        console.log(`Até mais usuário! ${socket.id}`); // LOG do servidor
//        socket.emit('disconected'); // enviando para os clientes mensagem de desconectado
//        console.log('###############################'); // LOG do servidor
//
//    })
//})

// Utilizando o servidor na porta 3000
server.listen(3000, ()=>{
    console.log('http://localhost:3000');
});
