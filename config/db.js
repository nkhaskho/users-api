const mongoose = require("mongoose");

module.exports = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            //useUnifiedTopology: true,
            //useCreateIndex: false,
        };
        // ${process.env.DB_NAME}
        // mongodb+srv://dbuser:<password>@cluster0.xf5thoq.mongodb.net/?retryWrites=true&w=majority
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xf5thoq.mongodb.net/?retryWrites=true&w=majority`, connectionParams);
        console.log("Connected to database.");
    } catch (error) {
        console.log("Could not connect to database", error);
    }
};