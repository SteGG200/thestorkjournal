import fastify from "fastify";
import cookiePlugin from "@fastify/cookie"
import multipartPlugin from "@fastify/multipart"
import middlewarePlugin from '@fastify/middie'
import cors from 'cors'
import xXssProtection from 'x-xss-protection'

import { authenticationRoute } from "./api/authentication/authentication";
import lucia from "./api/authentication/setup_auth";
import { articleRoute } from "./api/article/article";
import { uploadImageRoute } from "./uploadImage";

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

  server.register(multipartPlugin)

  await server.register(middlewarePlugin)

  server.use(cors({
    origin: process.env.CLIENT_URL ?? "*",
    credentials: true,
    methods: ['GET', 'POST']
  }))

  server.use(xXssProtection())

  server.register(authenticationRoute, {
    prefix: '/auth'
  })

  server.register(articleRoute, {
    prefix: '/article'
  })

  server.register(uploadImageRoute, {
    prefix: '/upload'
  })
}

const startServer = async () =>{
  try{
    await pluginsRegister();
    server.listen({port: server.config.port, host: '0.0.0.0'}, (err, address) => {
      server.log.info(`Server listening at ${address}`)
    });
  }catch(err){
    server.log.error(err)
    process.exit(1)
  }
}

startServer();
