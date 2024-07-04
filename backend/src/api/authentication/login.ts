import { FastifyPluginAsync } from "fastify";
import { authenticateUser } from "../../database/userHandler.js";
import lucia from "./setup_auth.js";
import { isAuthenticated } from "../../utils/authentication.js";
import { createUserInfoCookie } from "../../utils/cookieHandler.js";

export const loginRoute : FastifyPluginAsync = async (fastify, option) => {
	fastify.get('/', (req, res) => {
		res.send("This is login page.")
	})

	fastify.post<{
		Body: BodyLoginAPI
	}>('/', async (req, res) => {
		const authentication = await isAuthenticated(fastify, req)

		if(authentication){
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

		const userProfile = await authenticateUser(email, password);

		if(!userProfile){
			res.statusCode = 401;
			res.send({message: "Incorrect username or password"})
			return
		}

		await lucia.deleteExpiredSessions()

		const session = await lucia.createSession(userProfile.id,{})
		const sessionCookie = lucia.createSessionCookie(session.id)

		res.cookie(sessionCookie.name, sessionCookie.value)

		// Add userId to cookie
		const tokenUserInfo = createUserInfoCookie(userProfile)

		res.cookie(fastify.config.cookieName.userInfo, tokenUserInfo)

		res.statusCode = 200;
		res.send({message: "User logged in successfully"})
	})
}