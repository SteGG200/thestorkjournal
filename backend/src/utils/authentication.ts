import { FastifyInstance, FastifyRequest } from "fastify";
import lucia from "../api/authentication/setup_auth";
import jwt, { JwtPayload } from "jsonwebtoken"

export const isAuthenticated = async (fastify: FastifyInstance, req: FastifyRequest) => {
	const cookieHeader = req.headers.cookie
	const sessionId = lucia.readSessionCookie(cookieHeader?? "")

	if(!sessionId) return undefined;

	const { session, user } = await lucia.validateSession(sessionId)

	if(!session || !user) return undefined;

	const token_user_info = req.cookies[fastify.config.cookieName.user_info]

	if(!token_user_info){
		return undefined
	}

	const user_info = jwt.verify(token_user_info, process.env.JWT_SECRET_KEY as string)

	if((user_info as JwtPayload).id == user.id){
		return user
	}

	return undefined
}