import { GQLContext } from 'src/types';
import { Arg, Ctx, Int, Mutation, Resolver } from 'type-graphql';
import { BooleanWithError } from './types';
import fs from 'fs';
import path from 'path';
import { ROOTDIRNAME } from '../constants';
import { Listing } from '@entities/Listing';
import { createMapFromListings } from '@lib/util';

@Resolver()
export class ReverbResolver {
    @Mutation(() => BooleanWithError)
    public async importAllReverbListings(
        @Ctx() { rc, em }: GQLContext
    ): Promise<BooleanWithError> {
        try {
            const listings = await em.find(Listing, {});
            const idsInUse = createMapFromListings(listings);

            console.time('getAllReverbListings');
            const allReverbListings = await rc.getMyListings();
            console.timeEnd('getAllReverbListings');

            const novelListings = allReverbListings.filter(
                (listing: { [any: string]: any }) => !idsInUse.has(listing.id)
            );

            fs.writeFileSync(
                path.join(ROOTDIRNAME + '/../testing/novelAll.json'),
                JSON.stringify(novelListings, null, 2)
            );

            console.log('starting DB import');
            for (const listing of novelListings) {
                const newListing = Listing.fromReverb(listing);
                await em.persistAndFlush(newListing);
                console.log(`${newListing.id} imported`);
            }

            return { data: true };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    @Mutation(() => BooleanWithError)
    public async importRecentReverbListings(
        @Ctx() { rc, em }: GQLContext
    ): Promise<BooleanWithError> {
        try {
            const listings = await em.find(Listing, {});
            const idsInUse = createMapFromListings(listings);

            console.time('getRecentReverbListings');
            const recentReverbListings = await rc.getMyListingsRecent();
            console.timeEnd('getRecentReverbListings');

            const novelListings = recentReverbListings.filter(
                (listing: { [any: string]: any }) => !idsInUse.has(listing.id)
            );

            fs.writeFileSync(
                ROOTDIRNAME + '/../testing/novelRecent.json',
                JSON.stringify(novelListings, null, 2)
            );

            console.log('starting DB import');
            for (const listing of novelListings) {
                const newListing = Listing.fromReverb(listing);
                await em.persistAndFlush(newListing);
                console.log(`${newListing.id} imported`);
            }

            return { data: true };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    @Mutation(() => BooleanWithError)
    public async importImagesToListing(
        @Ctx() { rc, em }: GQLContext,
        @Arg('id', () => Int) id: number
    ) {
        try {
            const listing = await em.findOne(Listing, { id });
            if (!listing) {
                return {
                    data: false,
                    errors: [
                        {
                            message: 'Listing not found',
                            field: 'ID',
                            code: '404',
                        },
                    ],
                };
            }

            if (listing.reverbImagesImported) {
                return {
                    data: false,
                    errors: [
                        {
                            message: 'Images already imported',
                            field: 'ID',
                            code: '404',
                        },
                    ],
                };
            }

            await listing.importReverbImages(rc);

            await em.persistAndFlush(listing);
            return { data: true };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    //This is a test function to see if the images are being imported correctly. DO NOT USE IN PRODUCTION //TODO remove this
    @Mutation(() => BooleanWithError)
    public async importImagesToAllListings(@Ctx() { rc, em }: GQLContext) {
        try {
            const listings = await em.find(Listing, {});

            if (listings.length === 0 || listings.length === undefined) {
                return {
                    data: false,
                    errors: [
                        {
                            message: 'No listings found',
                            field: 'ID',
                            code: '404',
                        },
                    ],
                };
            }

            for (const listing of listings) {
                if (!listing.reverbImagesImported) {
                    await listing.importReverbImages(rc);
                    await em.persistAndFlush(listing);
                }
            }

            return { data: true };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }
}
