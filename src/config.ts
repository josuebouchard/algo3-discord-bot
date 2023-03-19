import dotenv from 'dotenv';
import type { Config } from './interfaces/Config';
dotenv.config();

const env = process.env;

const config = {
    token: env.TOKEN!,
    clientID: env.CLIENT_ID!,
    guildID: env.GUILD_ID!,
    studentRoleID: env.STUDENT_ROLE_ID!,
    mitosisVoiceChannelID: env.DONNOR_VOICE_CHANNEL_ID!,
    mitosisCategoryID: env.DONNOR_CATEGORY_ID!,
    studentsQueryChannelID: env.STUDENTS_QUERY_CHANNEL_ID!,
    teachersQueryChannelID: env.TEACHERS_QUERY_CHANNEL_ID!,
    githubWebhookID: env.GITHUB_WEBHOOK_ID!,
    papersTextChannelID: env.PAPERS_TEXT_CHANNEL_ID!,
    readmeTextChannelID: env.README_TEXT_CHANNEL_ID!,
    generalTextChannelID: env.GENERAL_TEXT_CHANNEL_ID!,
    queryLogTextChannelID: env.QUERY_LOG_TEXT_CHANNEL_ID!,
    mongoURL: env.MONGO_URL!,
} satisfies Config;

export default config;
