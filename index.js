const express = require('express'); // importa o express
const path = require('path'); // importa para utilizar os caminhos

const app = express(); // Inicializa o app
const server = require('http').createServer(app); // criando o servidor
const io = require('socket.io')(server); // importando e utilizando o socketio no servidor

app.use(express.static(path.join(__dirname, 'public')));  //utilizando a pasta public para abrir arquivos html
app.set('views', path.join(__dirname, 'public'));// declarando que public será utilizado como views
app.engine('html', require('ejs').renderFile);//utilizar como renderizador o ejs
app.set('view engine', 'html');// utilizando o ejs e a engine criada anteriormente

// ao acessar / renderiza o index.html
app.use('/', (req, res)=>{
    res.render('index.html');
});


// Lista de mensagens
let mensagens = [];

// socket io ao conectar
io.on('connection', socket => {
    console.log('###############################'); // LOG do servidor
    console.log(`Usuário conectado: ${socket.id}`); // LOG do servidor
    console.log('Mensagens anteriores: ', mensagens); // LOG do servidor
    socket.emit('previousMessages', mensagens); // enviando mensagens salvas no servidor
    console.log('Enviando mensagens salvas!'); // LOG do servidor

    socket.on('sendMessage', data => {
        console.log(`\tUsuário: ${data.usuario}`); // LOG do servidor
        console.log(`\tMensagem recebida: "${data.mensagem}"`);// LOG do servidor
        mensagens.push(data); // salvando as mensagens
        socket.broadcast.emit('recivedMessage', data); // enviando mensagem para todos os cliente
        console.log('\tMensagem enviada para todos os clients!');// LOG do servidor
    })

    socket.on('disconnect', function(){
        console.log(`Até mais usuário! ${socket.id}`); // LOG do servidor
        socket.emit('disconected'); // enviando para os clientes mensagem de desconectado
        console.log('###############################'); // LOG do servidor

    })
})

// Utilizando o servidor na porta 3000
server.listen(3000);
