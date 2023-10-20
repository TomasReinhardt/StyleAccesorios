const dbConnection = require('../databases')
const connection = dbConnection();

var controllerSale = {

    getSales: (req,res) => {
        var saleDate = req.params.date+'%';
        connection.query('SELECT * FROM StyleAccessoriossales WHERE date like ?',[saleDate], (err, result) => {
            if(err) return res.status(500).send({ message: 'error al cargar' })
            if(!result) return res.status(404).send({ message: 'no existen ventas' })
            return res.status(200).send({ result })
        })
    },

    getDates: (req,res) => {
        connection.query('SELECT date FROM StyleAccessoriossales', (err, result) => {
            if(err) return res.status(500).send({ message: 'error al cargar' })
            if(!result) return res.status(404).send({ message: 'no existen fechas' })
            return res.status(200).send({ result })
        })
    },

    addSale: (req,res) => {
        const newSale = {
            total: req.body.total,
            listProducts: req.body.listProducts,
            buyer: req.body.buyer
        }

        connection.query('INSERT INTO StyleAccessoriossales SET ?',[newSale], (err,result) => {
            if(err) return res.status(500).send(err.sqlMessage)
            if(!result) return res.status(404).send({ message: 'no se a podido guardar la venta' })
            return res.status(200).send({message:'Save sale'})
        })
    },

    deleteSale: (req,res) => {
        var saleId = req.params.id;
        connection.query('DELETE FROM StyleAccessoriossales WHERE id = ?',[saleId], (err,result) => {
            if(err) return res.status(500).send({ message: 'error al eliminar' })
            return res.status(200).send({message:'Delete sale'})
        })
    }

}

module.exports = controllerSale;