import { MongoClient } from 'mongodb';
import config from './config';

const client = new MongoClient(config.mongoURL);
const db = client.db();

export type Student = {
    padron: number;
    email: string;
    grupo?: number;
    nombre: string;
};

export type Log =
    {
        type: 'help_result';
        createdAt: string;
        result: 'brindada' | 'desestimada';
        helper: string;
        helped: string;
    }
    | {
        type: 'request_term_role';
        createdAt: string;
        issuerDiscordName: string;
        issuerDiscordId: string;
        padron: number;
    };

// Collections
export const studentsCollection = db.collection<Student>('students');
export const logsCollection = db.collection<Log>('logs');

export const getStudentByPadron = (padron: number) =>
    studentsCollection.findOne({ padron }, { projection: { _id: false } });

export const getStudentByEmailAndPadron = (email: string, padron: number) =>
    studentsCollection.findOne(
        { email, padron },
        { projection: { _id: false } }
    );
