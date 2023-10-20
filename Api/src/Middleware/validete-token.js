const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    const Token = req.header('authorization')
    if (!Token) return res.status(401).json({error: "acceso denegado"})
    try {
        const token = Token.split(' ')[1]
        const check = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = check
        next()
    } catch(error) {
        res.status(400).json({error: 'token no es valido'})
    }
}

module.exports = verifyToken;