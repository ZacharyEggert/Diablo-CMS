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

    constructor(options?: {
        username: string;
        password: string;
        accessRevoked?: boolean;
        email: string;
    }) {
        if (options) {
            this.username = options.username;
            this.password = options.password;
            this.accessRevoked = options.accessRevoked || false;
            this.email = options.email;
        }
    }
}
