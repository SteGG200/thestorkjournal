import { FastifyPluginAsync } from "fastify";
import { authenticateUser } from "../../database/authentication/authentication";
import lucia from "./setup_auth";

export const loginRount : FastifyPluginAsync = async (fastify, option) => {
	fastify.get('/', (req, res) => {
		res.send("This is login page.")
	})

	fastify.post<{
		Body: BodyLogin
	}>('/', async (req, res) => {
		const { email, password } = req.body;
		
		if(!email || email == "" || !password || password == "") {
			res.statusCode = 400
			res.send({message: "Invalid email"})
			return
		}

		const userId = await authenticateUser(email, password);

		if(!userId){
			res.statusCode = 403;
			res.send({message: "Incorrect username or password"})
			return
		}

		const session = await lucia.createSession(userId,{})
		const sessionCookie = lucia.createSessionCookie(session.id)

		res.setCookie(sessionCookie.name, sessionCookie.value)

		res.statusCode = 200;
		res.send({message: "User logged in successfully"})
	})
}