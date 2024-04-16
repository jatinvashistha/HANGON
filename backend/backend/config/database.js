const mongoose = require('mongoose');
exports.connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI).then((e) => {
        console.log("the database is connected")
    }).catch((e) =>{
        console.log("the connection in database is  ",e);
    })
}