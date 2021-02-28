const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    GuildID: {type: String, required: true},
    GuildName: {type: String, required: true},
    GuildUUID: {type: String, required: true},
    GuildKey: {type: String, required: true},
    GuildActive: {type: String, required: true},
    GuildVcStatus: {type: String, required: true},
    GuildVcFileExtion: {type: String, required: true}
})

module.exports = mongoose.model("Guild", GuildSchema);