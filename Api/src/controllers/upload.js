const dbConnection = require('../databases')
const connection = dbConnection();
var fs = require('fs').promises;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        //cb(null,'ClientProd/products');
        cb(null,'./products');
    },
    filename: function (req,file,cb) {
        let name = `image-${Date.now()}.${file.mimetype.split('/')[1]}`;
        cb(null,name);
    }
})

const upload = multer({storage:storage});

exports.upload = upload.single('image');

exports.uploadFile = (req,res) => {
    var productId = req.params.id;
    var product = {
        imgUrl: req.file.filename
    };
    connection.query('SELECT imgUrl FROM StyleAccessoriosproducts WHERE id = ?',[productId], (err, result) => {
        if (err) return res.status(500).send({ message: 'error al cargar' });
        if (!result) return res.status(404).send({ message: 'no existen productos' });
        if(result[0].imgUrl != "") {
            fs.unlink('./products/'+result[0].imgUrl)
                .then(() => {
                    console.log('File removed')
                }).catch(err => {
                    console.error('Something wrong happened removing the file', err)
                })
        };

        connection.query('UPDATE StyleAccessoriosproducts SET ? where id = ?',[product,productId], (err,result) => {
            if (err) return res.status(500).send({ message: 'error al actualizar' });
            if (!result) return res.status(404).send({ message: 'no existe el product' });
            return res.status(200).send(result);
        });

    })

}