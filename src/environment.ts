import * as dotenv from 'dotenv'

dotenv.config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' })

export const environment = {
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,

	BE_ENDPOINT: process.env.REACT_APP_BE_ENDPOINT
}
