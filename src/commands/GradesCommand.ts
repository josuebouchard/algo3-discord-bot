import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../interfaces/Command';
import { emailIsValid, padronIsValid } from '../utils';

export default {
    execute: async (interaction: CommandInteraction) => {
        const email = interaction.options.data[0].value as string;
        const padron = interaction.options.data[1].value as string;

        await interaction.deferReply({ ephemeral: true });

        if (!emailIsValid(email) || !padronIsValid(padron)) {
            await interaction.editReply(
                'Datos ingresados inválidos (revisá que estén bien escritos y recordá que tenés que utilizar los mismos usaste para llenar el forms)'
            );
        }

        // await interaction.editReply(
        //     'En breve se te enviará un mail con el link para que puedas acceder a tus notas'
        // );
        await interaction.editReply('Este comando aún no está disponible :P');
    },

    data: new SlashCommandBuilder()
        .setName('notas')
        .setDescription('Send you a link')
        .addStringOption((option) =>
            option
                .setName('email')
                .setDescription('FIUBA Email Category')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('padrón')
                .setDescription('Padron Category')
                .setRequired(true)
        ),
} satisfies Command;
