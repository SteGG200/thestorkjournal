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