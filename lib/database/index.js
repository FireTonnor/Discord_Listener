const mongoose = require("mongoose")
const settings = require("../../modules/config/settings")
const firebase = require("firebase-tools")

if (settings.database.enabled !== false) {
    mongoose.connect(settings.database.Uil, { useUnifiedTopology: true, useNewUrlParser: true , useFindAndModify: false});
}
