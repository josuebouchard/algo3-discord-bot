export interface Config {
    // Discord bot connection
    token: string;
    clientID: string;
    guildID: string;

    // Discord server
    studentRoleID: string;
    mitosisVoiceChannelID: string;
    mitosisCategoryID: string;
    studentsQueryChannelID: string;
    teachersQueryChannelID: string;

    papersTextChannelID: string;
    readmeTextChannelID: string;
    generalTextChannelID: string;
    queryLogTextChannelID: string;

    // Miscelaneous
    githubWebhookID: string;
}
