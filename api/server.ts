import express, { json } from "express"
import cors from "cors"
import router from "./routes"
import { typeDefs, resolvers } from "./controllers/graphql/index"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"

const port = 8000
const server: express.Application = express()
const app = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
})

;(async () => {
  await app.start()
  server.use(cors())
  server.use("/graphql", json(), expressMiddleware(app))
  server.use(router)

  server.listen(port, () => {
    console.log(`Server listen on port ${port}`)
  })
})()
