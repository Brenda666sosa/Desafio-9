import mysql from 'mysql';
import express from 'express';

const app = express();
const port = 3304;

app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'videojuegos'
});

connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});



// Crear tabla
app.get('/crear-tabla', (req, res) => {
    const createTableQuery =
      ` CREATE TABLE videojuegos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        genero VARCHAR(255) NOT NULL,
        plataforma VARCHAR(255) NOT NULL
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

app.get('', (req, res) => {
    res.send('Bienvenido a la API de videojuegos');
});

// Crear videojuego
app.post('/crear-videojuegos', (req, res) => {
    const { nombre, genero, plataforma } = req.body;
    const query = `INSERT INTO videojuegos (nombre, genero, plataforma) VALUES (?, ?, ?)`;

    connection.query(query, [nombre, genero, plataforma], (err, result) => {
        if (err) {
            console.error('Error al crear videojuego:', err);
            res.status(500).json({ error: 'Error al crear videojuego' });
            return;
        }
        res.json({ id: result.insertId, nombre, genero, plataforma });
    });
});

// Leer videojuegos
app.get('/videojuegos', (req, res) => {
    const query = `SELECT * FROM videojuegos`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener videojuegos:', err.sqlMessage); // Agrega sqlMessage para más detalle
            res.status(500).json({ error: 'Error al obtener videojuegos', details: err.sqlMessage });
            return;
        }
        res.json(results);
    });
});


// Actualizar videojuego
app.put('/videojuegos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, genero, plataforma } = req.body;
    const query = `
      UPDATE videojuegos
      SET nombre = ?, genero = ?, plataforma = ?
      WHERE id = ?`;

    connection.query(query, [nombre, genero, plataforma, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar videojuego:', err);
            res.status(500).json({ error: 'Error al actualizar videojuego' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Videojuego no encontrado' });
            return;
        }
        res.json({ id, nombre, genero, plataforma });
    });
});

// Eliminar videojuego
app.delete('/videojuegos/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM videojuegos WHERE id = ?`;

    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar videojuego:', err);
            res.status(500).json({ error: 'Error al eliminar videojuego' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Videojuego no encontrado' });
            return;
        }
        res.json({ message: 'Videojuego eliminado correctamente' });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

export default app;
