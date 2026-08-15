const mongoose = require('mongoose');

const DB = process.env.DB_URL;

const connectedDB = () => {
    mongoose
    .connect(DB)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    })
};

module.exports = connectedDB;