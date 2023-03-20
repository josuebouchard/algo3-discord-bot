import consola from 'consola';
import { Client, Intents, Collection, Channel, GuildChannel } from 'discord.js';
import { Config } from '../interfaces/Config';
import { Command } from '../interfaces/Command';
import { Event } from '../interfaces/Event';
import { Button } from '../interfaces/Button';
import { QueryQueue } from '../components/models/QueryQueue';
import { EmbedPage } from '../components/models/EmbedPage';
import { EmbedPageInterface } from '../interfaces/EmbedPage';
import { loadDynamicFiles } from '../utils';
import { logsCollection } from '../dataRepository';

class Bot extends Client {
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public buttons: Collection<string, Button> = new Collection();
    public embeds: Collection<string, EmbedPage> = new Collection();
    public queryQueue: QueryQueue = new QueryQueue();
    public config;
    public logger;

    public constructor(config: Config, logger = consola) {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_WEBHOOKS,
            ],
        });
        this.config = config;
        this.logger = logger;
    }

    public async start(): Promise<void> {
        await this.loadCommands();
        await this.loadEvents();
        await this.loadButtons();
        this.login(this.config.token);
    }

    private async loadCommands() {
        this.logger.info(`Loading commands...`);

        loadDynamicFiles<Command>('./commands', {
            isExportDefault: true,
        }).forEach((command) => {
            this.commands.set(command.data.name, command);
            this.logger.success(`Command ${command.data.name} loaded.`);
        });

        this.logger.success(`Commands loaded.`);
    }

    private async loadEvents() {
        this.logger.info(`Loading events...`);

        loadDynamicFiles<Event>('./events').forEach((event) => {
            if (event.once)
                this.once(event.name, (...args) => event.execute(...args));
            else this.on(event.name, (...args) => event.execute(...args));

            this.logger.success(`Listening to ${event.name} event.`);
        });

        this.logger.success(`Events loaded.`);
    }

    private async loadButtons() {
        this.logger.info(`Loading buttons...`);

        loadDynamicFiles<Button>('./components/buttons').forEach((button) => {
            this.buttons.set(button.data.customId!, button);
            this.logger.success(`Button ${button.data.customId} loaded.`);
        });

        this.logger.success(`Buttons loaded.`);
    }

    public async loadEmbeds() {
        this.logger.info(`Loading embeds...`);

        loadDynamicFiles<EmbedPageInterface>(
            './components/embed_pages'
        ).forEach(async (embedPage) => {
            this.embeds.set(embedPage.data.name, embedPage.data);
            if (
                embedPage.data.name === 'students' ||
                embedPage.data.name === 'teachers'
            ) {
                this.queryQueue.addObserver(embedPage.data);
            }

            if (embedPage.data.autoSend) {
                await embedPage.data.send();
                this.logger.success(`Embed ${embedPage.data.name} sent.`);
            }
        });

        this.logger.success(`Sent ${this.embeds.size} embeds.`);
    }

    public async removeUnusedClonedChannels() {
        const unusedClonedChannels = this.channels.cache.filter(
            (channel) =>
                channel.isVoice() &&
                this.isMitosisCategory(channel) &&
                this.isNotDonor(channel) &&
                channel.members.size === 0
        );

        this.logger.info(
            `Removing ${unusedClonedChannels.size} unused channels...`
        );

        const channelDeletions = await Promise.allSettled(
            unusedClonedChannels.map((channel) => channel.delete())
        );
        channelDeletions.forEach((channelDeletion) => {
            if (channelDeletion.status == 'rejected')
                this.logger.error(channelDeletion.reason);
        });

        this.logger.success(`Unused channels removed.`);
    }

    private isNotDonor(channel: Channel) {
        return channel.id !== this.config.mitosisVoiceChannelID;
    }

    private isMitosisCategory(channel: GuildChannel) {
        return channel.parentId === this.config.mitosisCategoryID;
    }

    // TODO: reenable when ready
    /*
    public scheduleMessages() {
        this.logger.info(`Scheduling messages...`);
        let next_class_embed: EmbedPage;

        if (event.summary.includes('[Virtual]')) {
            next_class_embed = this.embeds.get('nextVirtualClass') as EmbedPage;
        } else if (event.summary.includes('[Presencial]')) {
            next_class_embed = this.embeds.get(
                'nextFaceToFaceClass'
            ) as EmbedPage;
        } else if (event.summary.toLowerCase().includes('holiday')) {
            next_class_embed = this.embeds.get('holiday') as EmbedPage;
        } else {
            this.logger.error(`Invalid class type.`);
        }

        // Mensaje del día anterior al mediodía.
        cron.schedule(
            '0 00 12 * * 1,4',
            () => {
                this.logger.info('Sending class reminder...');
                next_class_embed.send();
                this.logger.success('Class remainder sent.');
            },
            { timezone: 'America/Argentina/Buenos_Aires' }
        );

        // El mensaje de una hora antes de los martes.
        cron.schedule(
            '0 00 18 * * 2',
            () => {
                this.logger.info('Sending class reminder...');
                next_class_embed.send();
                this.logger.success('Class remainder sent.');
            },
            { timezone: 'America/Argentina/Buenos_Aires' }
        );

        // El mensaje de una hora antes de los viernes.
        cron.schedule(
            '0 30 16 * * 5',
            () => {
                this.logger.info('Sending class reminder...');
                next_class_embed.send();
                this.logger.success('Class remainder sent.');
            },
            { timezone: 'America/Argentina/Buenos_Aires' }
        );

        cron.schedule(
            '0 00 11 * * *',
            async () => {
                this.logger.info('Loading next class event data...');
                await this.updateNextClassData();
                this.logger.success('Next class event data loaded.');
            },
            { timezone: 'America/Argentina/Buenos_Aires' }
        );
    }
    */

    // TODO: reenable when ready
    // private async updateNextClassData() {
    //     child_process.spawn('python3', [
    //         './submodules/next_class_info_scraper.py',
    //     ]);
    // }

    public async logHelp(
        creationDate: Date,
        helped: string,
        helper: string,
        result: string
    ) {
        this.logger.info(
            `Logging help asked by ${helper} helped by Grupo ${helped} (${result})`
        );
        await logsCollection.insertOne({
            type: 'help',
            createdAt: creationDate.toISOString(),
            result,
            helper,
            helped
        });
    }

    static dateFromISO(isoDate: string, timeZone: string) {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
            timeZone: timeZone,
        });
    }
}

export { Bot as AlgoBot };
