const dbConnection = require('../databases');
const connection = dbConnection();
require('dotenv').config()


var controllerBuy = {

    stockValidate: (req,res) => {
        let auxProducts = [];
        let idList = [];
        for (let i = 0; i < req.body.length; i++) {
            let item = {
                id: req.body[i].item.id,
                price: req.body[i].item.price,
                itemCant: req.body[i].itemCant,
            };
            auxProducts.push(item);
            idList.push(req.body[i].item.id);
        }
        connection.query('SELECT id,price,stock FROM products WHERE id IN (?)',[idList],(err,result) => {
            if(err) return res.status(500).send({message: 'Error al cargar',err});
            if (!result) return res.status(404).send({message: 'No existen productos'});

            let stock = [];
            let price = [];

            for (let i = 0; i < auxProducts.length; i++) {
                if(auxProducts[i].itemCant > result[i].stock){
                    stock.push(auxProducts[i]);
                }
                if(auxProducts[i].price != result[i].price){
                    price.push(auxProducts[i]);
                }
            }
            return res.status(200).send({stock,price});
        })
    },
    
    updateStock: (req,res) => {
        let idList = [];
        for (let i = 0; i < req.body.length; i++) {
            idList.push(req.body[i].item.id);
        }
        connection.query('SELECT id,price,stock FROM products WHERE id IN (?)',[idList],(err,result) => {
            if(err) return res.status(500).send({message: 'Error al cargar',err});
            if (!result) return res.status(404).send({message: 'No existen productos'});
            for (let i = 0; i <req.body.length; i++) {
                let item = {
                    stock: result[i].stock-req.body[i].itemCant
                }
                connection.query('UPDATE products SET ? where id = ?',[item,req.body[i].item.id], (err,result) => {
                    if (err) return res.status(500).send({ message: 'error al actualizar' });
                    if (!result) return res.status(404).send({ message: 'no existe el producto' });
                });
            }  
            return res.status(200).send({message: 'Stock Update'});
        })
    }

}

module.exports = controllerBuy;
