const dbConnection = require('../databases')
const connection = dbConnection();
var fs = require('fs');
var fsu = require('fs').promises;
var path = require('path');

var controllerProduct = {
    getProducts: (req,res) => {
        connection.query('SELECT p.id,p.name,p.price,p.stock,c.category,p.imgUrl,p.description FROM StyleAccessoriosproducts AS p INNER JOIN StyleAccessorioscategorys AS c ON p.category = c.id ORDER BY name', (err, result) => {
            if (err) return res.status(500).send({ message: err.sqlMessage });
            if (!result) return res.status(404).send({ message: 'no existen productos' });
            
            return res.status(200).send({ result });
        })
    },

    getProductsEdit: (req,res) => {
        connection.query('SELECT * FROM StyleAccessoriosproducts ORDER BY name', (err, result) => {
            if (err) return res.status(500).send({ message: 'error al cargar' });
            if (!result) return res.status(404).send({ message: 'no existen productos' });
            return res.status(200).send({ result });
        })
    },

    getProductsValidate: (req,res) => {
        var productsId = req.params.id;
        let idList = productsId.split('-');
        
        connection.query('SELECT * FROM StyleAccessoriosproducts WHERE id IN (?)',[idList],(err,result) => {
            if(err) return res.status(500).send({message: 'Error al cargar',err});
            if (!result) return res.status(404).send({message: 'No existen categorias'});
            return res.status(200).send({result});
        })
    },

    getProduct: (req,res) => {
        var productId = req.params.id;
        connection.query('SELECT p.id,p.name,p.price,p.stock,c.category,p.imgUrl,p.description FROM StyleAccessoriosproducts AS p INNER JOIN StyleAccessorioscategorys AS c ON p.category = c.id WHERE p.id = ?',[productId], (err, result) => {
            if (err) return res.status(500).send({ message: 'error al cargar' });
            if (!result) return res.status(404).send({ message: 'no existen productos' });
            return res.status(200).send({ result });
        })
    },

    addProduct: (req,res) => {
        const product = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description,
            imgUrl: ""
        }

        connection.query('INSERT INTO StyleAccessoriosproducts SET ?',[product], (err,result) => {
            if(err) return res.status(500).send(err.sqlMessage)
            if(!result) return res.status(404).send({ message: 'no se a podido guardar el producto' })
            return res.status(200).send({ id: result.insertId });
            //agregar devolucion de id
        })
    },

    updateProduct: (req,res) => {
        var productId = req.params.id;
        var product = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description
        };
        connection.query('UPDATE StyleAccessoriosproducts SET ? where id = ?',[product,productId], (err,result) => {
            if (err) return res.status(500).send({ message: 'error al actualizar' });
            if (!result) return res.status(404).send({ message: 'no existe el product' });
            return res.status(200).send({id: result.insertId});
        });
    },

    deleteProduct: (req,res) => {
        var productId = req.params.id;
        var imgUrl = "";
        connection.query('SELECT imgUrl FROM StyleAccessoriosproducts WHERE id = ?',[productId],(err,result) => {
            if (err) return res.status(500).send({message:'error al actualizar'});
            if (!result) return res.status(404).send({ message: 'no existe el producto'});
            fsu.unlink('./products/'+result[0].imgUrl)
                .then(()=> {
                    console.log('file removed');
                }).catch( err => {
                    console.error('Something wrong happened removing the file',err);
                })
            connection.query('DELETE FROM StyleAccessoriosproducts where id = ?',[productId], (err,result) => {
                if (err) return res.status(500).send({ message: 'error al actualizar' });
                if (!result) return res.status(404).send({ message: 'no existe el product' });
                return res.status(200).send({ message: 'product delete'});
            });
        });
    },

    getCategorys: (req,res) => {
        connection.query('SELECT * FROM StyleAccessorioscategorys ORDER BY category', (err,result) => {
            if(err) return res.status(500).send({message: 'Error al cargar',err});
            if (!result) return res.status(404).send({message: 'No existen categorias'});
            return res.status(200).send({ result });
        })
    },

    addCategory: (req,res) => {
        const category = {
            category: req.body.category,
        }
        connection.query('INSERT INTO StyleAccessorioscategorys SET ?',[category], (err,result)=> {
            if(err) return res.status(500).send({message: 'Error al cargar',err});
            if (!result) return res.status(404).send({message: 'No se a podido guardar'});
            return res.status(200).send({ message:'Save category' });
        })
    },

    updateCategory: (req,res) => {
        var categoryId = req.params.id;
        var category = {
            category: req.body.category,
        };
        connection.query('UPDATE StyleAccessorioscategorys SET ? where id = ?',[category,categoryId], (err,result) => {
            if (err) return res.status(500).send({ message: 'error al actualizar' });
            if (!result) return res.status(404).send({ message: 'no existe la categoria' });
            return res.status(200).send({message:'Update category'});
        });
    },

    deleteCategory: (req,res) => {
        var categoryId = req.params.id;
        var category = {
            category: "",
        };
        connection.query('UPDATE StyleAccessorioscategorys SET ? where id = ?',[category,categoryId], (err,result) => {
            if (err) return res.status(500).send({ message: 'error al actualizar' });
            if (!result) return res.status(404).send({ message: 'no existe la categoria' });
            return res.status(200).send({message:'Update category'});
        });
    },

    getImage: function (req, res){
        var file = req.params.image;
		var path_file = './products/'+file;

		fs.access(path_file, (err) => {
			if(err){
                return res.status(200).send({message: "No existe la imagen..."});
			}else{
				return res.sendFile(path.resolve(path_file));
			}
		});
    }


}

module.exports = controllerProduct;