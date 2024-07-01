import fastify from "fastify";
import cookiePlugin from "@fastify/cookie"

import { authenticationRoute } from "./api/authentication/authentication";

const server = fastify({
  logger: true,
})

server.decorate('config',{
  port: Number(process.env.PORT) ?? 3000,
})

server.get('/', (req, res) => {
  res.send("This is a test server");
})

const pluginsRegister = () => {
  server.register(cookiePlugin,{
    secret: "mysecret",
    parseOptions: {}
  })

  server.register(authenticationRoute, {
    prefix: '/auth'
  })

}

const startServer = () =>{
  try{
    pluginsRegister();
    server.listen({port: server.config.port}, (err, address) => {
      server.log.info(`Server listening at ${address}`)
    });
  }catch(err){
    server.log.error(err)
    process.exit(1)
  }
}

startServer();