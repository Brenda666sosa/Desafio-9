import * as chai from 'chai';
import supertest from 'supertest';
import chaiHttp from 'chai-http';
import app from './index.js';

chai.use(chaiHttp);
const request = supertest.agent(app);

describe('Pruebas de API de videojuegos', () => {
    it('Debería agregar un nuevo videojuego', (done) => {
        const newVideojuego = {
            nombre: 'Nuevo Videojuego',
            genero: 'Acción',
            plataforma: 'PC'
        };

        request
            .post('/crear-videojuegos')
            .send(newVideojuego)
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.include({
                    nombre: 'Nuevo Videojuego',
                    genero: 'Acción',
                    plataforma: 'PC'
                });
                done();
            });
    });

    it('Debería obtener todos los videojuegos', (done) => {
        request
            .get('/videojuegos')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.an('array');
                done();
            });
    });
});
