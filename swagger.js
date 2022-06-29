const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ["./routes/users.js"]

const doc = {
    info: {
        version: "1.0.0",
        title: "Users API",
        description: "Users Management API documentation."
    },
    schemes: ['http'],
    host: `localhost:3000`,
    basePath: "/api",
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js');
})