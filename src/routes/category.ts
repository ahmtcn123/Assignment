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

export default async function category(fastify: FastifyInstance, opts) {

    fastify.route({
        method: 'GET',
        url: '/get',
        handler: getCategories,
    });

    fastify.route({
        method: 'POST',
        url: '/create',
        handler: createCategory,
    });

    fastify.route({
        method: 'POST',
        url: '/update',
        handler: updateCategory,
    });

    fastify.route({
        method: 'DELETE',
        url: '/delete',
        handler: deleteCategory,
    });

    async function createCategory(req, reply) {
        const data = await req.file()
        if (data?.fields['file'] && data?.fields['name']) {
            let file = data.file;
            const fileName = Date.now() + data.filename;
            const mainDirectory = path.resolve(__dirname, `../../images/${fileName}`);
            const inputBuffer = await stream2buffer(file);
            await sharp(inputBuffer as any).resize(320, 320).toFile(mainDirectory)

            try {
                let created = await constants.db.categories.create({
                    data: {
                        ...(
                            data.fields.parent_id && !isNaN(Number(data.fields.parent_id.value)) && {
                                parent_id: Number(data.fields.parent_id.value)
                            }
                        ),
                        name: data.fields['name'].value,
                        picture: path.basename(mainDirectory),
                    }
                });
                reply.send(created);
            } catch (_) {
                unlinkSync(mainDirectory);
                reply.status(404).send({ error: 'Parent category not found' });
            }
        } else {
            reply.status(400).send({
                message: 'No file or name provided'
            })
        }
    }

    async function updateCategory(req, reply) {
        if (req.body?.name && req.body?.id) {
            try {
                let updated = await constants.db.categories.update({
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
            } catch (error) {
                reply.status(404).send({
                    message: 'Not found'
                });
            }
        } else {
            reply.status(400).send({
                message: 'No name or id provided'
            })
        }
    }

    async function deleteCategory(req, reply) {
        if (isNaN(Number(req.query?.id))) {
            reply.status(404).send({
                message: 'No id provided'
            });
        } else {
            try {
                const deletedCategory = await constants.db.categories.delete({
                    where: {
                        id: Number(req.query.id)
                    }
                });
                unlinkSync(path.resolve(__dirname, `../../images/${deletedCategory.picture}`))
                return {
                    status: 200,
                    data: deletedCategory
                };
            } catch (_) {
                reply.status(404).send({
                    message: 'Category not found'
                });
            }
        }
    }

    async function getCategories(req, reply) {
        let categories = await constants.db.categories.findMany({
            where: {
                parent: {
                    is: null
                }
            },
            include: {
                parent: true,
                children: {
                    include: {
                        products: true
                    }
                },
            },
        });

        function getCount(category: any) {
            if (category.products) {
                return {
                    ...category,
                    productsLength: category.products.length
                }
            } else {
                return {
                    ...category,
                    children: category.children.map(getCount)
                }
            }
        }

        return {
            status: 200,
            data: categories.map(getCount)
        };
    }
}