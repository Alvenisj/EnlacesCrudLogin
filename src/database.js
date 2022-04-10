const mysql = require('mysql');
const { database } = require('./keys');
const { promisify } = require('util');

const pool = mysql.createPool(database);

pool.getConnection((err, Connection) => {

    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }

        if (err.code === 'ER_CON_COUNT_ERROR') {

            console.error('DATABASE HAS TO MANY CONNECTION');
        }

        if (err.code === 'ECONNREFUSED  ') {

            console.error('DATABASE CONNECTION WAS REFUSED');
        }

    }

    if (Connection) Connection.release();

    console.log('DB IS CONNECTED SUCCESSFULY');
    return;
      
});

//ESTAMOS CONVIRTIENDO EL POOL EN PROMESAS QUE PUEDAN USAR ASYNC AWAIT
pool.query = promisify(pool.query);
module.exports = pool;


    