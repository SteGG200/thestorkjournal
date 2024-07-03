import fastify from "fastify";
import cookiePlugin from "@fastify/cookie"
import middlewarePlugin from '@fastify/middie'
import cors from 'cors'

import { authenticationRoute } from "./api/authentication/authentication";
import lucia from "./api/authentication/setup_auth";
import { articleRoute } from "./api/article/article";

const server = fastify({
  logger: true,
})

server.decorate('config',{
  port: Number(process.env.PORT) ?? 3000,
  cookieName: {
    sessionId: lucia.sessionCookieName,
    userInfo: "iuser"
  },
  articleCategories: ['sport']
})

server.get('/', (req, res) => {
  res.send("This is a test server");
})

const pluginsRegister = async () => {
  server.register(cookiePlugin,{
    secret: process.env.COOKIE_SECRET,
    parseOptions: {
      maxAge: 172800,
      path: '/'
    }
  })

  await server.register(middlewarePlugin)
  server.use(cors({
    origin: [process.env.CLIENT_URL ?? "*"],
    credentials: true,
    methods: ['GET', 'POST']
  }))

  server.register(authenticationRoute, {
    prefix: '/auth'
  })

  server.register(articleRoute, {
    prefix: '/article'
  })
}

const startServer = async () =>{
  try{
    await pluginsRegister();
    server.listen({port: server.config.port}, (err, address) => {
      server.log.info(`Server listening at ${address}`)
    });
  }catch(err){
    server.log.error(err)
    process.exit(1)
  }
}

startServer();