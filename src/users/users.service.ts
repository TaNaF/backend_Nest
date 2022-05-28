import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

export type User = any;

@Injectable()
export class UsersService {
    constructor(@InjectConnection() private readonly connection: Connection) {}

    async findOne(username: string): Promise<User | undefined> {
        const user = await this.connection.query(`SELECT * FROM student WHERE student_id = '${username}'`)
        return user[0];
    }
}