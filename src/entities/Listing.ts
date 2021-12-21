import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ReverbListing } from 'src/types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Listing {
    @Field(() => Number)
    @PrimaryKey({ index: true })
    id!: number;

    @Field(() => Number)
    @Property({ nullable: true })
    reverbId?: number;

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

    static fromReverb(reverbListing: ReverbListing) {
        const listing = new Listing();
        listing.reverbId = reverbListing.id;
        listing.reverbSku = reverbListing.sku;
        listing.title = reverbListing.title;
        listing.make = reverbListing.make;
        listing.model = reverbListing.model;
        listing.year = reverbListing.year;
        listing.finish = reverbListing.finish;
        listing.description = reverbListing.description;
        listing.condition = reverbListing.condition.display_name;
        listing.categories = reverbListing.categories.map(c => c.full_name);
        listing.price = reverbListing.price.amount_cents / 100;
        listing.slug = reverbListing.slug;
        listing.photos = reverbListing.photos.map(p => p._links.small_crop.href);
        return listing;
    }



    update(options?: Partial<Listing>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
