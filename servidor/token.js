const jwt = require("jsonwebtoken")
const SECRET_KEY = "estaesmiclaveultrasecreta";
const crearToken = async(email) => {
    const token = jwt.sign({ email }, SECRET_KEY)
    return token
}

const verificarToken = async(token) => {

    const verify = jwt.verify(token, SECRET_KEY);
    if (verify){ return verify.email }
    return null;
}

module.exports = { crearToken, verificarToken }
