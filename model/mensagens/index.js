const   mongoose = require('mongoose'),
        Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

let Mensagem = new Schema({
    usuario: {type: String, require: true},
    mensagem: {type: String, require: true}
},{
    versionKey: false
});

module.exports = mongoose.model('Mensagem', Mensagem);

