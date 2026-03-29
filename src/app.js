import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import healthRoute from "./routes/health.js";
import stockRoute from "./routes/stock.js";
const app = Fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(healthRoute);
app.register(stockRoute);

export default app;
