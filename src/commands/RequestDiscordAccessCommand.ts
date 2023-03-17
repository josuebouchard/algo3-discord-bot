import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { Command } from '../interfaces/Command';
import { emailIsValid, padronIsValid } from '../utils';
import students from '../../assets/Listado.json';

function studentIsValid(email: string, padron: string): boolean {
    return (students as any[]).some(
        (student) => student.includes(email) && student.includes(padron)
    );
}

const currentCuatrimestre = '1c2023';

export default {
    execute: async (interaction: CommandInteraction): Promise<void> => {
        const email = interaction.options.data[0].value as string;
        const padron = interaction.options.data[1].value as string;
        const member = interaction.member as GuildMember;

        await interaction.deferReply({ ephemeral: true });

        if (
            !emailIsValid(email) ||
            !padronIsValid(padron) ||
            !studentIsValid(email, padron)
        ) {
            await interaction.editReply(
                'Datos ingresados inválidos (revisá que estén bien escritos y recordá que tenés que utilizar los mismos usaste para llenar el forms). \n*Si llevás varios intentos, consultá con un docente...*'
            );
            return;
        }

        let studentRole = member.guild.roles.cache.find(
            (role) => role.name === currentCuatrimestre
        )!;

        if (
            member.roles.cache.find((role) => role.name === currentCuatrimestre)
        ) {
            await interaction.editReply(
                'Ya tenías el rol de grupo asignado!\n*Si es el equivocado, ponete en contacto con un docente para que vea tu situación.*'
            );
            return;
        }

        await member.roles.add(studentRole);

        await interaction.editReply(
            'Validación exitosa!, ya deberías poder ver más canales. \n*Si no es el caso contrario contactate con un docente.*'
        );
    },
    data: new SlashCommandBuilder()
        .setName('pedir_rol_alumno')
        .setDescription(
            'Verifica tus datos y te asigna permisos de alumno si existis en nuestra planilla.'
        )
        .addStringOption((option) =>
            option.setName('email').setDescription('email').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('padrón').setDescription('padron').setRequired(true)
        ),
} satisfies Command;
