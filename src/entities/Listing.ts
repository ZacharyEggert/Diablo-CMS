import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Listing {
    @PrimaryKey()
    id!: number;

    @Property({ nullable: false })
    title!: string;

    @Property({ nullable: false })
    make!: string;

    @Property({ nullable: false })
    model!: string;

    @Property({ nullable: true })
    submodel?: string;

    @Property({ nullable: true })
    year?: number;

    @Property({ nullable: true })
    finish?: string;

    @Property({ nullable: false })
    description!: string;

    @Property({ nullable: false })
    price!: number;

    @Property({ nullable: false })
    cost!: number;

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
