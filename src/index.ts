import { AlgoBot } from './client/Client';
import config from './config';

const client: AlgoBot = new AlgoBot();
client.start(config);

export { client };
