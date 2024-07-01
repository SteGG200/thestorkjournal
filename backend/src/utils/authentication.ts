import { FastifyRequest } from "fastify";
import lucia from "../api/authentication/setup_auth";

export const isAuthenticated = async (req: FastifyRequest) => {
	const cookieHeader = req.headers.cookie
	const sessionId = lucia.readSessionCookie(cookieHeader?? "")

	if(!sessionId) return undefined;

	const { session, user } = await lucia.validateSession(sessionId)

	if(!session || !user) return undefined;

	return user
}