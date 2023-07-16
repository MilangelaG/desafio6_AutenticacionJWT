const { Pool } = require('pg')
var crypto = require('crypto');
const SECRET_KEY = 'estaesmiclaveultrasecreta';

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '123456',
    database: 'softjobs',
    allowExitOnIdle: true
})

const toHash = (data) => {
    var key = crypto.createCipher('aes-128-cbc', SECRET_KEY);
    var hash = key.update(data, 'utf8', 'hex')
    hash += key.final('hex');
    return hash
}

const createUser = async(userData) => {
    const passwordHash = toHash(userData.password)
    const values = [userData.email, passwordHash, userData.rol, userData.lenguage ];
    const insert = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4);"
    result = await pool.query(insert, values)
    return result.rowCount == 1
}

const searchUser = async(email) => {
    const select = "SELECT * FROM usuarios WHERE email = $1";
    var result = await pool.query(select, [email])
    result = result.rows[0]
    return result
}

const loginUser = async(userData) => {
    const passwordHash = toHash(userData.password)
    const values = [userData.email, passwordHash];
    const select = "SELECT * FROM usuarios WHERE email = $1 AND password = $2;";
    result = await pool.query(select, values)
    return result.rowCount == 1
}

module.exports = { createUser, loginUser, searchUser }
