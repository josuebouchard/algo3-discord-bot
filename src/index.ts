import { AlgoBot } from './client/Client';
import config from './config';

const client: AlgoBot = new AlgoBot(config);
client.start();

export { client };
