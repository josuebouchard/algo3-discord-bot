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

// Collections
const studentsCollection = db.collection<Student>('students');

export const getStudentByPadron = (padron: number) =>
    studentsCollection.findOne({ padron }, { projection: { _id: false } });

export const getStudentByEmailAndPadron = (email: string, padron: number) =>
    studentsCollection.findOne(
        { email, padron },
        { projection: { _id: false } }
    );
