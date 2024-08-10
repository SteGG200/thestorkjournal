import { PUBLIC_SERVER_URL } from '$env/static/public'
import { redirect } from '@sveltejs/kit'
import { z } from 'zod'

const signupSchema = z.object({
	email: z.string().email({ message: 'Invalid email address'}),
	name: z.string(),
	password: z.string().min(8, { message: 'Password must be at least 8 or more characters long'}),
	re_password: z.string()
})

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ fetch, request }) => {
		const data = await request.formData()

		const dataJson = Object.fromEntries(data.entries())

		const validation = signupSchema.safeParse(dataJson)

		if(!validation.success){
			return { success: false, error: validation.error.issues[0].message, previousState: { email: dataJson.email, name: dataJson.name}}
		}

		if(dataJson.password !== dataJson.re_password){
			return { success: false, error: 'Passwords do not match', previousState: { email: dataJson.email, name: dataJson.name}}
		}

		delete dataJson["re_password"]

		const response = await fetch(`${PUBLIC_SERVER_URL}/auth/signup`, {
			method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataJson)
		})

		const result = await response.json()

		if(!response.ok){
			return { success: false, error: result.message, previousState: { email: dataJson.email, name: dataJson.name}}
		}

		redirect(307, '/login')
	}
}