const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbConnection = require('../databases');
const connection = dbConnection();

const schemaRegister = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    username: Joi.string().min(4).max(255).required(),
    password:  Joi.string().min(8).max(1024).required(),
})

const schemaLogin = Joi.object({
    name: Joi.string().min(0).max(255).required(),
    username: Joi.string().min(4).max(255).required(),
    password: Joi.string().min(8).max(1024).required()
})

var controllerAuth = {

    registerUser: async (req,res) => {
        const {error} = schemaRegister.validate(req.body);
        if(error) return res.status(200).send({error:error.details[0].message});

        connection.query('SELECT * FROM users WHERE username = ?',[req.body.username], async (err, result) => {
            if(err) return res.status(500).send({ message: 'error al cargar' })
            if(!result) return res.status(404).send({ message: 'no se a podido guardar el usuario' })
            if(JSON.stringify(result) == '[]') {

                const salt = await bcrypt.genSalt(10);
                const password = await bcrypt.hash(req.body.password,salt);

                const user = {name: req.body.name, username: req.body.username, password: password};
                connection.query('INSERT INTO users SET ?',user, (err,result) => {
                    if(err) return res.status(500).send({ message: 'error al guardar' })
                    if(!result) return res.status(404).send({ message: 'no se a podido guardar el usuario' })
                    return res.status(200).send({message:'Usuario guardado'})
                })
            }
            else {
                return res.status(400).send({message:'El usuario ya utilizado'})
            }
        })
    },

    loginUser: async (req,res) => {
        connection.query('SELECT * FROM users WHERE username = ?',[req.body.username], async (err, result) => {
            if(err) return res.status(500).send({ message: 'error al cargar' })
            if(!result) return res.status(404).send({ message: 'no se a podido guardar el cliente' })
            if(JSON.stringify(result) == '[]') return res.status(400).send( {error: true, message: 'Usuario invalido'})
            else {
                const validPassword = await bcrypt.compare(req.body.password, result[0].password);
                if(!validPassword) return res.status(400).send({ error: true, message: 'Constraseña invalida' })

                const {error} = schemaLogin.validate(req.body);
                if(error) return res.status(200).send({error:error.details[0].message});

                const token = jwt.sign({
                    username: result[0].username,
                    id: result[0].id
                }, process.env.TOKEN_SECRET)
        
                res.header('auth-token',token).json({
                    user: result[0].name,
                    token
                })
            }
        })
    },

    checkToken: (req,res) => {
        return res.status(200).send({message:"valid token"})
    },

    checkApi: (req,res) => {
        return res.status(200).send({message:"api Ready"})
    }
}

module.exports = controllerAuth;