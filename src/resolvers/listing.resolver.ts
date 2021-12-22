import { Listing } from '@entities/Listing';
import { GQLContext } from 'src/types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { BooleanWithError, ListingResponse, ListingsResponse } from './types';

@Resolver()
export class ListingResolver {
    // get all listings
    @Query(() => ListingsResponse)
    public async listings(@Ctx() { em }: any): Promise<ListingsResponse> {
        try {
            const listings = await em.find(Listing, {});
            return { data: listings };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    // get a listing by id
    @Query(() => ListingResponse)
    public async listing(
        @Ctx() { em }: any,
        @Arg('id', () => Int) id: number
    ): Promise<ListingResponse> {
        try {
            const listing = await em.findOne(Listing, id);
            if (!listing) {
                return {
                    errors: [
                        {
                            message: 'Listing not found',
                            field: 'ID',
                            code: '404',
                        },
                    ],
                };
            }
            return { data: listing };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    // create a listing
    @Mutation(() => ListingResponse)
    public async createListing(
        @Ctx() { em }: any,
        @Arg('title') title: string,
        @Arg('make') make: string,
        @Arg('model') model: string,
        @Arg('description') description: string,
        @Arg('price') price: number,
        @Arg('cost') cost: number,
        @Arg('imageUrls', () => [String]) photos: string[],
        @Arg('submodel', { nullable: true }) submodel?: string,
        @Arg('year', { nullable: true }) year?: string,
        @Arg('finish', { nullable: true }) finish?: string
    ): Promise<ListingResponse> {
        try {
            const listing = new Listing({
                cost,
                description,
                photos,
                make,
                model,
                price,
                submodel,
                title,
                year,
                finish,
            });
            await em.persistAndFlush(listing);
            return { data: listing };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    //delete a listing
    @Mutation(() => BooleanWithError)
    public async deleteListing(
        @Ctx() { em }: GQLContext,
        @Arg('id', () => Int) id: number
    ): Promise<BooleanWithError> {
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
            await em.removeAndFlush(listing);
            return { data: true };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    //delete all listings
    @Mutation(() => BooleanWithError)
    public async deleteAllListings(
        @Ctx() { em }: GQLContext
    ): Promise<BooleanWithError> {
        try {
            const listings = await em.find(Listing, {});
            for (const listing of listings) {
                em.remove(listing);
            }
            await em.flush();
            return { data: true };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }
}
