import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ReverbApiClient } from '@zacharyeggert/reverb-api';
import { ReverbListing } from 'src/types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Listing {
    @Field(() => Number)
    @PrimaryKey({ index: true })
    id!: number;

    @Field(() => Number, { nullable: true })
    @Property({ nullable: true })
    reverbId?: number;

    @Field(() => String, { nullable: true })
    @Property({ nullable: true })
    reverbSku?: string;

    @Field(() => String, { nullable: true })
    @Property({ nullable: true })
    reverbSelfLink?: string;

    @Field(() => Boolean, { nullable: true })
    @Property({ nullable: true, default: false })
    reverbImagesImported: boolean = false;

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
    @Property({ nullable: false, columnType: '' })
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
        listing.categories = reverbListing.categories.map((c) => c.full_name);
        listing.price = reverbListing.price.amount_cents;
        listing.slug = reverbListing.slug;
        listing.photos = reverbListing.photos.map(
            (p) => p._links.large_crop.href
        );
        listing.cost = 0;
        listing.reverbSelfLink = reverbListing._links.self.href;
        return listing;
    }

    async importReverbImages(rc: ReverbApiClient) {
        if (this.reverbImagesImported) {
            console.error(new Error('Listing already imported'));
            return;
        }
        if (!this.reverbId) {
            console.error(new Error('Listing has no reverb source'));
            return;
        }
        if (!this.reverbSelfLink) {
            console.error(new Error('Listing has no reverbSelfLink'));
            return;
        }
        try {
            const self = await rc.get(this.reverbSelfLink);
            this.photos = self.data.photos.map(
                (p: any) => p._links.large_crop.href
            );
            this.reverbImagesImported = true;
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return;
        }
    }

    update(options?: Partial<Listing>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
