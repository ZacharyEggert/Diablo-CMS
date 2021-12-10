import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
    @ObjectIdColumn({ unique: true })
    id!: ObjectID;

    @Column({ unique: true, nullable: false })
    username!: string;

    @Column({ nullable: false })
    password!: string;

    @Column({ default: false, nullable: false })
    accessRevoked!: boolean;
}
