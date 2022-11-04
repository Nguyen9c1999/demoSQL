const express = require('express');
const app = express();
const layouts = require("express-ejs-layouts")
const bodyParser = require("express");
const mysql = require("mysql");
const fileUpload = require('express-fileupload');


app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use(layouts)
app.use(express.static('public'))
app.set("layout","index")
app.set('views','./scr/views');
app.set('view engine','ejs');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'democonnectdatabase',
    charset: 'utf8_general_ci'
});
connection.connect(function (err) {
    if (err) {
        throw err.stack;
    }
    else
        console.log("connect success");
});

app.get('/',(req, res)=>{
     let sql = "select * from product"
    connection.query(sql,(err,dataProduct)=>{
        if(err){
            console.log(err)
        }else {
            res.render('product/show',{
                products : dataProduct
            })
        }
    })

})
app.get('/create',(req, res)=>{
    res.render('product/create')

})
app.post('/create',(req, res)=>{

    let file = req.files
   if(file){
       let image = file.image
       image.mv('./public/uploads/'+image.name)
       let sql = `insert into product(name, image) VALUES ( '${req.body.name}','/uploads/${image.name}' ) `
       connection.query(sql,(err)=>{
           if (err){
               console.log(err)
           }else {
               res.redirect('/')
           }
       })

   }



})



app.get('/edit/:id',(req, res)=>{
    let {id}=req.params
    let sql = `select * from product where idProduct = ${id}`
    connection.query(sql, (err,dataProduct)=>{
        if(err){
            console.log(err)
        }else {
            console.log(dataProduct[0].name)
            res.render('product/edit',{name:dataProduct[0].name})
        }
    })


})
app.post('/edit/:id',(req, res)=>{
   let {id}=req.params
    let file = req.files
    if(file){
        let image = file.image
        image.mv('./public/uploads/'+image.name)
        let sql = `UPDATE product SET name = '${req.body.name}', image = '/uploads/${image.name}' WHERE idProduct=${id};`
        connection.query(sql,(err)=>{
            if (err){
                console.log(err)
            }else {
                res.redirect('/')
            }
        })
    }



})
app.get('/delete/:id',(req, res)=>{
    let {id}=req.params
    let sql=`DELETE FROM product WHERE idProduct=${id}`
    connection.query(sql,(err)=>{
        if (err){
            console.log(err)
        }else {
            res.redirect('/')
        }
    })


})
// tìm kiếm
app.post('/',(req, res)=>{
    console.log(req.body.find)
    let sql = `select * from product where name like '%${req.body.find}%'`
    connection.query(sql,(err,data)=>{
        if (err){
            console.log(err)
        }else {
                  if(data.length==0){
                      res.render('product/showFile',{products:data,text : 'không có sản phẩm nào'})
                  }else {
                      res.render('product/showFile',{products:data,text : ''})
                  }




        }
    })
})


app.listen(3000,()=>{
    console.log('server is runing 3000')
})