const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

//Configuracion para el uso de peticiones post 
app.use(bodyParser.urlencoded({extended:false}));

//plantillas sean dinamicas 
app.set('view engine','ejs');

// Conexion a la base de datos 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'xdxd',
    database: 'proyecto_pw2bd',
    port: 3306
});


// Comprobacion de la conexion a la base de daros 
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

// Iniciamos el server 
const port = 3019;
app.listen(port,()=>{
    console.log(`Servidor en funcionamiento desde http://localhost:${port}`);
});

// Vistas CRUD

// Read
app.get('/', (req, res) => {
    const query = 'SELECT id, nombre, apellido_paterno, apellido_materno, email, numero_tel, direccion_per, ciudad, codigo_postal, fecha_registro, edad, genero FROM personas';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.send('Error');
        } else {
            res.render('index', { users: results });
        }
    });
});

//Agregar usuarios 

app.post('/add', (req, res) => {
    const { nombre, apellido_paterno, apellido_materno, email, numero_tel, direccion_per, ciudad, codigo_postal, fecha_registro, edad, genero } = req.body;
    const query = 'INSERT INTO personas (nombre, apellido_paterno, apellido_materno, email, numero_tel, direccion_per, ciudad, codigo_postal, fecha_registro, edad, genero) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [nombre, apellido_paterno, apellido_materno, email, numero_tel, direccion_per, ciudad, codigo_postal, fecha_registro, edad, genero], (err) => {
        if (err) {
            console.error('Error adding user:', err);
            res.send('Error');
        } else {
            res.redirect('/');
        }
    });
});

// Mostrar formulario para agregar nuevo usuario
app.get('/creaUser', (req, res) => {
    res.render('creaUser');
});

//editar usuario
/*
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const {nombre,apellido_paterno,apellido_materno,email,numero_tel,direccion_per,ciudad,codigo_postal,fecha_registro,edad,genero} = req.body;
    const query = 'UPDATE personas SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, email = ?, numero_tel = ?, direccion_per = ?, ciudad = ?, codigo_postal = ?, fecha_registro = ?, edad = ?, genero = ? WHERE id = ?'
    db.query(query, [nombre, apellido_paterno, apellido_materno, email, numero_tel, direccion_per, ciudad, codigo_postal, fecha_registro, edad, genero,id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.send('Error');
        } else {
            res.redirect('/');
        }
    });
});
*/
// Ruta GET para mostrar el formulario de edición con los datos del usuario
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;  
    const query = 'SELECT * FROM personas WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);  
            res.send('Error');
        } else {
            const user = results[0]; 
            res.render('edit', { user });
        }
    });
});
// Ruta POST para manejar la actualización de los datos del usuario
app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido_paterno, apellido_materno, email, numero_tel, direccion_per, ciudad, codigo_postal, fecha_registro, edad, genero } = req.body;
    const query = 'UPDATE personas SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, email = ?, numero_tel = ?, direccion_per = ?, ciudad = ?, codigo_postal = ?, fecha_registro = ?, edad = ?, genero = ? WHERE id = ?';
    db.query(query, [nombre, apellido_paterno, apellido_materno, email, numero_tel, direccion_per, ciudad, codigo_postal, fecha_registro, edad, genero, id], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.send('Error');
        }
        const selectQuery = 'SELECT * FROM personas';
        db.query(selectQuery, (err, users) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.send('Error');
            }else{
                res.redirect('/');
            }
        });
    });
});



//eliminar usuario
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM personas WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.send('Error');
        } else {
            res.redirect('/');
        }
    });
});

