import { FastifyPluginAsync } from "fastify";
import { authenticateUser } from "../../database/authentication/userHandler";
import lucia from "./setup_auth";
import { isAuthenticated } from "../../utils/authentication";
import jwt from "jsonwebtoken"

export const loginRoute : FastifyPluginAsync = async (fastify, option) => {
	fastify.get('/', (req, res) => {
		res.send("This is login page.")
	})

	fastify.post<{
		Body: BodyLogin
	}>('/', async (req, res) => {
		const userPossible = await isAuthenticated(fastify, req)

		if(userPossible){
			res.statusCode = 400
			res.send({message: "User already logged in"})
			return
		}

		const { email, password } = req.body;

		if(!email || email == "" || !password || password == "") {
			res.statusCode = 400
			res.send({message: "Invalid email"})
			return
		}

		const userId = await authenticateUser(email, password);

		if(!userId){
			res.statusCode = 401;
			res.send({message: "Incorrect username or password"})
			return
		}

		const session = await lucia.createSession(userId,{})
		const sessionCookie = lucia.createSessionCookie(session.id)

		res.setCookie(sessionCookie.name, sessionCookie.value)


		// Add userId to cookie
		const token_user_info = jwt.sign({userId}, process.env.JWT_SECRET_KEY as string, {
			expiresIn: '1d'
		})

		res.setCookie(fastify.config.cookieName.user_info, token_user_info)

		res.statusCode = 200;
		res.send({message: "User logged in successfully"})
	})
}