import request from 'supertest';
import app from '../src/server.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

describe('Pruebas de usuarios', () => {
    beforeAll(async () => {
        await prisma.$connect(); // Conecta a la base de datos
    });

    afterAll(async () => {
        await prisma.$disconnect(); // Desconecta de la base de datos
    });

    test("Debe ingresar al sistema", async () => {
        const response = await request(app)
        .post('/arast/usuarios/login')
        .send({ 
                "username" : "frevill"
            , "contrasena" : "HolaMundo12"
         })
         console.log(response)
         expect(response.statusCode).toBe(200)
    },10000)
});
