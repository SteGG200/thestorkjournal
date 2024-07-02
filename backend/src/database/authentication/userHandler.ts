import { User } from "lucia";
import sql from "../db"
import brcypt from "bcrypt"

export const authenticateUser = async (email: string, password: string) : Promise<User | undefined> => {
	const userPossible = await sql<UserProfileSchema[]>`SELECT * FROM users WHERE email = ${email}`

	if(userPossible.length == 0){
		return undefined;
	}

	const hashedPassword = userPossible[0].password
	
	const match = await brcypt.compare(password, hashedPassword)

	if(match ||	password === hashedPassword) {
		return {
			id: userPossible[0].id,
			name: userPossible[0].name,
      email: userPossible[0].email,
		}
	}
	return undefined
}

export const isEmailExisted = async (email: string) => {
	const userPossible = await sql<UserProfileSchema[]>`SELECT * FROM users WHERE email = ${email}`
  return userPossible.length > 0
}

export const createNewUser = async (name: string, email: string, password: string) => {
	const hashedPassword = await brcypt.hash(password, 10)

	await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword})`
}