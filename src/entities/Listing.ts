import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Listing {
    @Field(() => Number)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({ nullable: false })
    title!: string;

    @Field(() => String)
    @Property({ nullable: false })
    make!: string;

    @Field(() => String)
    @Property({ nullable: false })
    model!: string;

    @Field(() => String, { nullable: true })
    @Property({ nullable: true })
    submodel?: string;

    @Field(() => Number, { nullable: true })
    @Property({ nullable: true })
    year?: number;

    @Field(() => String, { nullable: true })
    @Property({ nullable: true })
    finish?: string;

    @Field(() => String)
    @Property({ nullable: false })
    description!: string;

    @Field(() => Number)
    @Property({ nullable: false })
    price!: number;

    @Field(() => Number)
    @Property({ nullable: false })
    cost!: number;

    @Field(() => [String])
    @Property()
    imageUrls!: string[];

    constructor(options?: Partial<Listing>) {
        if (options) {
            Object.assign(this, options);
        }
    }

    update(options?: Partial<Listing>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
