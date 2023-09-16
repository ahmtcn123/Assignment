import { FastifyInstance } from "fastify";
import { unlinkSync } from "fs";
import path from "path";
import sharp from "sharp";
import { Stream } from "stream";
import constants from "../constants";

async function stream2buffer(stream: Stream): Promise<Buffer> {

    return new Promise<Buffer>((resolve, reject) => {

        const _buf = Array<any>();

        stream.on("data", chunk => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", err => reject(`error converting stream - ${err}`));

    });
}

export default async function product(fastify: FastifyInstance, opts) {

    fastify.route({
        method: 'GET',
        url: '/get',
        handler: getProducts,
    });

    fastify.route({
        method: 'POST',
        url: '/create',
        handler: createProduct,
    });


    fastify.route({
        method: 'POST',
        url: '/update',
        handler: updateProduct,
    });

    fastify.route({
        method: 'DELETE',
        url: '/delete',
        handler: deleteProduct,
    });

    async function createProduct(req, reply) {
        const data = await req.file()
        if (data?.fields['file'] && data?.fields['name'] && data?.fields['category_id'] && !isNaN(Number(data.fields['category_id'].value))) {
            let file = data.file;
            const fileName = Date.now() + data.filename;
            const mainDirectory = path.resolve(__dirname, `../../images/${fileName}`);
            const inputBuffer = await stream2buffer(file);
            await sharp(inputBuffer as any).resize(320, 320).toFile(mainDirectory)

            try {
                let created = await constants.db.products.create({
                    data: {
                        category_id: Number(data.fields['category_id'].value),
                        name: data.fields['name'].value,
                        picture: path.basename(mainDirectory),
                    }
                });
                reply.send(created);
            } catch (_) {
                unlinkSync(mainDirectory);
                reply.status(404).send({ error: 'Category not found' });
            }
        } else {
            reply.status(400).send({
                message: 'No file, name or category_id provided'
            })
        }
    }

    async function updateProduct(req, reply) {
        if (req?.body?.name && req.body?.id) {
            try {
                let updated = await constants.db.products.update({
                    where: {
                        id: req.body.id
                    },
                    data: {
                        name: req.body.name
                    }
                });
                reply.send({
                    status: 200,
                    data: updated
                });
            } catch (_) {
                reply.status(404).send({
                    message: 'Not found'
                })
            }
        } else {
            reply.status(400).send({
                message: 'No name or id provided'
            })
        }
    }

    async function deleteProduct(req, reply) {
        if (isNaN(Number(req.query?.id))) {
            reply.status(404).send({
                message: 'No id provided'
            });
        } else {
            try {
                const deletedProduct = await constants.db.products.delete({
                    where: {
                        id: Number(req.query.id)
                    }
                });
                if (deletedProduct) {
                    unlinkSync(path.resolve(__dirname, `../../images/${deletedProduct.picture}`));
                }
                return {
                    status: 200,
                    data: deletedProduct
                };
            } catch (_) {
                reply.status(404).send({
                    message: 'Not found'
                });
            }
        }

    }

    async function getProducts(req, reply) {
        let products = await constants.db.products.findMany({
            where: {
                ...(
                    req.query.category_id && !isNaN(Number(req.query.category_id)) && {
                        category_id: Number(req.query.category_id)
                    }
                )
            }
        });
        return {
            status: 200,
            data: products,
        }
    }
}