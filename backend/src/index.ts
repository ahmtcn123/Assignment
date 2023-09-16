import formbody from '@fastify/formbody';
import multipart from '@fastify/multipart';
import fstatic from '@fastify/static';
import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';
import path from 'path';
import pino from 'pino';
import constants from './constants';
import category from './routes/category';
import product from './routes/product';
import cors from '@fastify/cors'


const port = "3000";

const startServer = async () => {
    const server = fastify({
        logger: pino({ level: 'info' }),
    });
    server.register(multipart)
    server.register(formbody)
    server.register(cors, {
        origin: ['http://localhost:3001'],
        methods: ['GET', 'POST', 'DELETE'],
        credentials: true,
    })

    // Add category route
    server.register(category, {
        prefix: "/api/category"
    })

    // Add product route
    server.register(product, {
        prefix: "/api/product"
    })

    server.register(fstatic, {
        root: path.join(__dirname, '../images'),
        prefix: '/public/', // optional: default '/'
    })

    constants.db = new PrismaClient();

    server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
    })
};

startServer()
