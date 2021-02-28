const mongoose = require("mongoose");

const File = new mongoose.Schema({
    _id: {type: String},
    date: {type: String},
    userid: {type: String}
})

module.exports = mongoose.model("File", File)