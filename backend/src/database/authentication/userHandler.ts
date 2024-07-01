import sql from "../db"
import brcypt from "bcrypt"

export const authenticateUser = async (email: string, password: string) => {
	const userPossible = await sql<UserProfileSchema[]>`SELECT * FROM users WHERE email = ${email}`

	const hashedPassword = userPossible[0].password
	
	const match = await brcypt.compare(password, hashedPassword)

	if(match ||	password === hashedPassword) {
		return userPossible[0].id;
	}
	return null
}

export const isEmailExisted = async (email: string) => {
	const userPossible = await sql<UserProfileSchema[]>`SELECT * FROM users WHERE email = ${email}`
  return userPossible.length > 0
}

export const createNewUser = async (name: string, email: string, password: string) => {
	const hashedPassword = await brcypt.hash(password, 10)

	await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword})`
}