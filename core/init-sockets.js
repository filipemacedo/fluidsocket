const socketCore = require("./listen-events");

/**
 * [description]
 * @param  {[type]} io      [description]
 * @param  {[type]} ioOfNsp [description]
 * @return {[type]}         [description]
 */
const globalNamespace = (io, ioOfNsp = undefined) => configs => {
  const { guards, listeners, connection, disconnect } = configs;

  let definedIO = ioOfNsp ? ioOfNsp : io;
  
  /**
   * [description]
   * @param  {[type]} Array.isArray(guards)) definedIO     [description]
   * @return {[type]}                        [description]
   */
  if (Array.isArray(guards))
    definedIO = guards.reduce((p, c) => p.use(c), definedIO);

  /**
   *
   */
  return definedIO.on("connection", async client => {
    connection && await connection(client);
    disconnect && client.on("disconnect", disconnect);

    socketCore({
      client,
      ioGlobal: io,
      ioOfNsp: definedIO
    })(listeners || {});


  });
};

/**
 * [description]
 * @param  {[type]} io [description]
 * @return {[type]}    [description]
 */
const customNamespace = io => (nsp, configs) => {
  const ioOfNsp = io.of(`/${nsp}`);

  return globalNamespace(io, ioOfNsp)(configs);
};

module.exports = io => configs => {
  /**
   * [globalNamespaceWithIO description]
   * @type {[type]}
   */
  const globalNamespaceWithIO = globalNamespace(io);

  /**
   * [customNamespaceWithIO description]
   * @type {[type]}
   */
  const customNamespaceWithIO = customNamespace(io);

  return Object.keys(configs).map(nsp => {
    if (nsp == "global") {
      return globalNamespaceWithIO(configs[nsp]);
    }

    return customNamespaceWithIO(nsp, configs[nsp]);
  });
};
