import mysql from 'mysql'; 
import express from 'express';  

const app = express();
app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 3300;

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'phpmyadmin'
});



app.get('/', (req, res) => {
    res.send('API funcionando correctamente');  
});


app.get('/crear-tabla', (req, res) => {
    
    const createTableQuery =
    `CREATE TABLE productos (
        id INT AUTO_INCREMENT PRIMARY KEY,  // 'id' es clave primaria y auto-incremental
        nombre VARCHAR(255) NOT NULL,       // 'nombre' no puede ser nulo
        precio DECIMAL(10,2) NOT NULL,      // 'precio' es un número decimal y no puede ser nulo
        descripcion TEXT                   // 'descripcion' es un texto y puede ser nulo
    )`;

   
    connection.query(createTableQuery, (err, results) => {
        if (err) {
            console.error('Error al crear la tabla', err);  
            res.status(500).send('Error al crear la tabla');  
        } else {
            console.log('Tabla creada exitosamente'); 
            res.send('Tabla creada exitosamente');  
        }
    });
});

//ruta para agregar un producto a la tabla productos

app.post('/agregar-producto', (req, res) => {    
    const { nombre, precio, descripcion } = req.body;

    const insertQuery = 
    'INSERT INTO productos (nombre, precio, descripcion) VALUES (?, ?, ?)';
    
    connection.query(insertQuery, [nombre, precio, descripcion], (err, results) => {
        if (err) {
            console.error('Error al agregar producto:', err);  
            res.status(500).send('Error al agregar el producto'); 
        } else {
            console.log('Producto agregado exitosamente'); 
            res.send('Producto agregado exitosamente'); 
        }
    });
});

//ruta para obtener todos los productos de la tabla productos
app.get('/productos', (req, res) => {    
    const selectQuery = 'SELECT * FROM productos';
    
    connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error al seleccionar productos', err);  
            res.status(500).send('Error al seleccionar productos');  
        } else {
            console.log('Productos seleccionados exitosamente');  
            res.json(results);  
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);  
});

process.on('SIGINT', () => {
    connection.end(() => {
        console.log('Conexión a la base de datos cerrada');
        process.exit(0);
    });
});

export default app;
