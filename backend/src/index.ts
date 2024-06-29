import fastify from "fastify";

import { authenticationRoute } from "./authentication/authentication";

declare module 'fastify' {
  interface FastifyInstance{
    config: {
      port: number;
    }
  }
}

const server = fastify({
  logger: true,
})

server.decorate('config',{
  port: Number(process.env.PORT) ?? 3000,
})

server.register(authenticationRoute, {
  prefix: '/auth'
})

server.get('/', (req, res) => {
  res.send("This is a test server");
})

server.listen({port: server.config.port}, (err, address) => {
  if(err){
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server is listening at ${address}`);
})