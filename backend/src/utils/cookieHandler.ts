import { User } from "lucia";
import jwt from 'jsonwebtoken'

export const createUserInfoCookie = (userProfile: User) => {
	return jwt.sign(userProfile, process.env.JWT_SECRET_KEY as string, {
		expiresIn: '1d'
	})
}

export const getUserInfoCookie = (token: string) => {
	return jwt.verify(token, process.env.JWT_SECRET_KEY as string) as User
}