const initializeSocket = require('./core/init-sockets')

module.exports.initializeSocket = initializeSocket

module.exports.eventSecondary = (cb) => ({ ioGlobal }) => result => cb(ioGlobal, result)
module.exports.eventMyNamespace = (cb) => ({ ioOfNsp }) => result => cb(ioOfNsp, result)
module.exports.eventPrimary = (cb) => ({ client }) => result => cb(client, result)