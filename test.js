import * as chai from 'chai';        
import supertest from 'supertest';    
import chaiHttp from 'chai-http';     
import app from './index.js'         


chai.use(chaiHttp);
const request = supertest.agent(app);


describe('API Tests', () => {

    it('Debería agregar un nuevo producto', (done) => {
        
        const newProduct = {
            nombre: 'Nuevo Producto',
            precio: 19.99,
            descripcion: 'Descripción del nuevo producto'
        };

        
        request
            .post('/agregar-producto')  
            .send(newProduct)           
            .end((err, res) => {       
                
                chai.expect(res).to.have.status(200);
               
                chai.expect(res.text).to.equal('Producto agregado exitosamente');
                done();  
            });
    });

   
    it('Debería obtener todos los productos', (done) => {
       
        request
            .get('/productos')  
            .end((err, res) => {  
                chai.expect(res).to.have.status(200);                
                chai.expect(res.body).to.be.an('array');
                done();  
            });
    });
});
