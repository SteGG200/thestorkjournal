import { Lucia, TimeSpan } from 'lucia';
import sql from '../../database/db';
import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql'

const adapter = new PostgresJsAdapter(sql, {
	user: "users",
	session: "user_sessions"
})

const lucia = new Lucia(adapter, {
	sessionCookie: {
		name: "user_info",
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	sessionExpiresIn: new TimeSpan(2, 'd'),
	getUserAttributes(databaseUserAttributes) {
		return {
			name: databaseUserAttributes.name,
			email: databaseUserAttributes.email,
		}
	},
})

export default lucia