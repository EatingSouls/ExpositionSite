const mongoose = require("mongoose");
module.exports = mongoose.connect(process.env.CONN_LINK,{ useNewUrlParser: true, useUnifiedTopology: true });