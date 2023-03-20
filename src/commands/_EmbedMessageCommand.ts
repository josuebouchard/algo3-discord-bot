import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Command } from '../interfaces/Command';

export default {
    execute: async (interaction: CommandInteraction) => {
        const [title, description, titleURL, imageURL] =
            interaction.options.data.map((elem) => elem.value as string);

        // const title = interaction.options.data[0].value as string;
        // const description = interaction.options.data[1].value as string;
        // const titleURL = interaction.options.data[2].value as string;
        // const imageURL = interaction.options.data[3].value as string;

        const embed = new MessageEmbed().setTitle(title).setAuthor({
            name: `${interaction.user.username}`,
            iconURL: `${interaction.user.avatarURL()}`,
        });

        if (description) embed.setDescription(description);

        if (titleURL) embed.setURL(titleURL);

        if (imageURL) embed.setImage(imageURL);

        await interaction.reply({ embeds: [embed] });
    },
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Escribí lo que querés decir, pero más lindo')
        .addStringOption((titleOption) =>
            titleOption
                .setName('título')
                .setDescription('El título del embed')
                .setRequired(true)
        )
        .addStringOption((descriptionOption) =>
            descriptionOption
                .setName('descripción')
                .setDescription('La descripción del embed')
        )
        .addStringOption((titleUrlOption) =>
            titleUrlOption
                .setName('url_para_título')
                .setDescription('Si querés que el título tenga URL')
        )
        .addStringOption((imageOption) =>
            imageOption.setName('imágen').setDescription('Link a una imágen')
        ),
} satisfies Command;
