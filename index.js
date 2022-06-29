const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
require('dotenv').config();

// Db config and connection
const connection = require("./config/db");

// Swagger API docs
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

// Routes
const users = require("./routes/users");
const auth = require("./routes/auth");

// Create new express app
const app = express()

// Connect to database cluster
connection();

// Middelwares
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/api", [auth, users]);


// Server listening
app.listen(process.env.PORT || 3000, () => {
    console.log("Server has started!");
    console.log("Listening on port ", process.env.PORT || 3000);
})