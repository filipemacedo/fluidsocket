const useGuards = event => (socketClient, guard) =>
  socketClient.use(async (data, next) => {
    /**
     *
     */
    const [eventEmitted, body] = data;
    /**
     * [guardWithClient description]
     * @type {[type]}
     */
    const guardWithClient = guard(socketClient);

    return event !== eventEmitted
      ? next()
      : await guardWithClient(JSON.parse(body), next);
  });
/**
 * [description]
 * @param  {[type]} socket [description]
 * @return {[type]}        [description]
 */
const processMethods = socketIO => ({ methods, name, method }) => {
  const { action, guards, after } = methods;

  if (!action) throw new Error("Action is required");

  const event = `${name}.${method}`;
  let { client, ioOfNsp } = socketIO;

  console.log(`Namespace ${ioOfNsp.name} [${event}] joinned`);

  /**
   * [description]
   * @param  {[type]} Array.isArray(guards)) socketMain    [description]
   * @return {[type]}                        [description]
   */
  if (Array.isArray(guards)) client = guards.reduce(useGuards(event), client);

  /**
   *
   */
  return client.on(`${event}`, async data => {
    /**
     * [result description]
     * @type {[type]}
     */
    try {
      const result = await action({
        body: typeof data == "string" ? JSON.parse(data) : data,
        ...(client || {})
      });

      /**
       *
       */
      return after.reduce(async (p, c) => await c(socketIO)(result), result);
    } catch (e) {
      return client.emit("customError", e);
    }
  });
};

/**
 * [description]
 * @param  {[type]} socket [description]
 * @return {[type]}        [description]
 */
const processListeners = socketIO => ({ listeners, name }) => {
  const processMethodsWithIO = processMethods(socketIO);

  /**
   * [Process the methods]
   * @param  {[type]} method [description]
   * @return {[type]}        [description]
   */
  return Object.keys(listeners).map(method =>
    processMethodsWithIO({
      methods: listeners[method],
      name,
      method
    })
  );
};

module.exports = socketIO => configs => {
  const names = Object.keys(configs);

  const processListenersWithIO = processListeners(socketIO);

  /**
   * [description]
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  return names.reduce(
    (p, name) =>
      p.concat(
        processListenersWithIO({
          listeners: configs[name],
          name
        })
      ),
    []
  );
};
