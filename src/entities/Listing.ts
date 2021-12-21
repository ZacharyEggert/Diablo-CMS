import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Listing {
    @Field(() => Number)
    @PrimaryKey({ index: true })
    id!: number;

    @Field(() => String)
    @Property({ nullable: true })
    reverbId?: string;

    @Field(() => String)
    @Property({ nullable: true })
    reverbSku?: string;

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

    @Field(() => String, { nullable: true })
    @Property({ nullable: true })
    year?: string;

    @Field(() => String, { nullable: true })
    @Property({ nullable: true })
    finish?: string;

    @Field(() => String)
    @Property({ nullable: false, columnType: 'text' })
    description!: string;

    @Field(() => String)
    @Property({ nullable: true })
    condition?: string;

    @Field(() => [String])
    @Property({ nullable: true })
    categories?: string[];

    @Field(() => Number)
    @Property({ nullable: false })
    price!: number;

    @Field(() => Number)
    @Property({ nullable: false })
    cost!: number;

    @Field(() => [String])
    @Property()
    photos!: string[];

    @Field(() => String)
    @Property({ nullable: false })
    slug!: string;

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
