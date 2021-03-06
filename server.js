const Rollbar = require('rollbar');
const app = require('./app');
const migrationsManager = require('./migrations');
const config = require('./config');
const logger = require('./app/logger');

const port = config.common.api.port || 8080;

Promise.resolve()
  .then(() => migrationsManager.check())
  .then(() => {
    const rollbar = new Rollbar({
      accessToken: config.common.rollbar.accessToken,
      enabled: !!config.common.rollbar.accessToken,
      environment: config.common.rollbar.environment || config.environment
    });
    app.use(rollbar.errorHandler());

    app.listen(port);

    logger.info(`Listening on port: ${port}`);
  })
  .catch(logger.error);
