import { FastifyPluginAsync } from "fastify";
import crypto from 'crypto'
import { put } from "@vercel/blob"

export const uploadImageRoute : FastifyPluginAsync = async (fastify, option) => {
	fastify.post('/', async (req, res) => {
		const image = await req.file()
		
		if(!image){
			res.statusCode = 400
			res.send({message: "Invalid image"})
			return;
		}

		// console.log(image)

		const imageName = `${image.filename.split('.')[0]}_${crypto.randomBytes(24).toString('hex')}.${image.mimetype.split('/')[1]}`

		// const blob = await put(imageName, image, {
		// 	contentType: contentType,
		// 	access: 'public'
		// })

		res.statusCode = 200
		res.send({result: 'OK', imageName})
	})
}