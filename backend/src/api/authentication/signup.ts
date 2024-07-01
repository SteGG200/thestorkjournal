import fastify, { FastifyPluginAsync } from "fastify";
import { createNewUser, isEmailExisted } from "../../database/authentication/userHandler";
import transporter from "../../utils/emailHandler";

export const signupRoute: FastifyPluginAsync = async (fastify, option) => {
	fastify.get('/', (req, res) => {
		res.send("This is signup page.")
	})

	fastify.post<{
		Body: BodySignup
	}>('/', async (req, res) => {
		const { name, email, password } = req.body;
    
		const emailExistance = await isEmailExisted(email)

		if(emailExistance) {
      res.statusCode = 400
      res.send({message: "Email already exists"})
      return
    }

		const info = await transporter.sendMail({
			from: "binhbhgl5@gmail.com",
			to: email,
			subject: "Welcome to our website",
      text: `Hello ${name}, welcome to our website.\nAccess this link to create your own article.\n${process.env.CLIENT_URL}`,
		})

		console.log(info.response)

		await createNewUser(name, email, password)

    res.statusCode = 200;
    res.send({message: "User is created successfully"})
	})
}