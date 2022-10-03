import ElekIoCore from '../src/index.js';

const core = await ElekIoCore.init({
  signature: {
    name: 'John Doe',
    email: 'john.doe@test.com',
  },
  log: {
    level: 'debug',
  },
});

export default core;
