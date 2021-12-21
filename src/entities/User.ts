import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class User {
    @Field(() => Number)
    @PrimaryKey({})
    id!: number;

    @Field(() => String)
    @Property({ unique: true, nullable: false })
    username!: string;

    // @Field(() => String) //Determines password visibility in GraphQL
    @Property({ nullable: false })
    password!: string;

    @Field(() => Boolean)
    @Property({ default: false })
    accessRevoked: boolean = false;

    @Field(() => String)
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
