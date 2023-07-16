const express = require('express')
const app = express()
const cors = require('cors')
const { createUser, loginUser, searchUser } = require('./consultas')
const { crearToken, verificarToken } = require('./token')

app.listen(3000, console.log("SERVER ON"))
app.use(cors())
app.use(express.json())

app.get("/", async (req, res) => {
    res.json({"hola": "mundo"})
})

app.get("/usuarios", async (req, res) => {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    var email = await verificarToken(token)
    var user = await searchUser(email)
    res.statusCode = 200;
    res.send({email: user.email, rol: user.rol, lenguage: user.lenguage});
})

app.post("/usuarios", async (req, res) => {
    let data = req.body;
    var usuarioCreado = await(createUser(data))
    if (usuarioCreado) {
        res.statusCode = 200;
        res.send('Yeah, usuario creado');
    }else{
        res.statusCode = 400;
        res.send('No se pudo crear el usuario');
    }
})

app.post("/login", async (req, res) => {
    let data = req.body;
    var userExist = await(loginUser(data))

    if (userExist) {
        token = await crearToken(data.email)
        res.statusCode = 200;
        res.send(token);
    }else{
        res.statusCode = 500;
        res.send('No se encontro registro del usuario');
    }
})
