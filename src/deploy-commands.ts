import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import consola from 'consola';

import config from './config';
import { commands } from './commands';

const commandsBody = commands.map((command) => command.data.toJSON());

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
    try {
        consola.info('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(config.clientID, config.guildID),
            { body: commandsBody }
        );

        consola.success('Successfully reloaded application (/) commands.');
    } catch (error) {
        consola.error(error);
    }
})();
