import postgres from 'postgres';
import brcypt from 'bcrypt'

const connectionString : string = process.env.DATABASE_URL!
const sql = postgres(connectionString)

export default sql