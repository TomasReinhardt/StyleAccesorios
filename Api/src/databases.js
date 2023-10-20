const mysql = require('mysql2');

module.exports = () => {
    return mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port:process.env.DB_PORT,
        typeCast: function castField(field, useDefaultTypeCasting) {
            if (field.type === "BIT" && field.length === 1) {
                let bytes = field.buffer();
                return bytes[0] === 1;
            }
            return useDefaultTypeCasting();
        }
    });
}