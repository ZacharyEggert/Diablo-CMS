import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
    @PrimaryKey({})
    id!: number;

    @Property({ unique: true, nullable: false })
    username!: string;

    @Property({ nullable: false })
    password!: string;

    @Property({ default: false })
    accessRevoked: boolean = false;

    @Property({ nullable: false })
    email!: string;
}