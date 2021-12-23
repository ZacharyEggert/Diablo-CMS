import { Listing } from '@entities/Listing';
import { GQLContext } from 'src/types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { BooleanWithError, ListingResponse, ListingsResponse } from './types';

@Resolver()
export class ListingResolver {
    // get all listings
    @Query(() => ListingsResponse)
    public async listings(
        @Ctx() { em }: GQLContext
    ): Promise<ListingsResponse> {
        try {
            const listings = await em.find(
                Listing,
                {},
                { orderBy: { price: 'DESC' } }
            );
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
        @Ctx() { em }: GQLContext,
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

    // get listing by slug
    @Query(() => ListingResponse)
    public async listingBySlug(
        @Ctx() { em }: GQLContext,
        @Arg('slug', () => String) slug: string
    ): Promise<ListingResponse> {
        try {
            const listing = await em.findOne(Listing, { slug });
            if (!listing) {
                return {
                    errors: [
                        {
                            message: 'Listing not found',
                            field: 'SLUG',
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

    // get listings by make
    @Query(() => ListingsResponse)
    public async listingsByMake(
        @Ctx() { em }: GQLContext,
        @Arg('make', () => String) make: string
    ): Promise<ListingsResponse> {
        try {
            const listings = await em.find(
                Listing,
                { make },
                { orderBy: { price: 'DESC' } }
            );
            return { data: listings };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    //get listings by category
    @Query(() => ListingsResponse)
    public async listingsByCategory(
        @Ctx() { em }: GQLContext,
        @Arg('category', () => String) category: string
    ): Promise<ListingsResponse> {
        try {
            const listings = await em.find(
                Listing,
                {},
                { orderBy: { price: 'DESC' } }
            );

            const filteredListings = listings.filter((listing) => {
                if (!listing.categories) {
                    return false;
                }
                for (const cat in listing.categories) {
                    if (
                        listing.categories[cat]
                            .toLowerCase()
                            .includes(category.toLowerCase())
                    ) {
                        return true;
                    }
                    // console.log(cat)
                    return false;
                }
            });

            return { data: filteredListings };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    // get listings by make and category
    @Query(() => ListingsResponse)
    public async listingsByMakeAndCategory(
        @Ctx() { em }: GQLContext,
        @Arg('make', () => String) make: string,
        @Arg('category', () => String) category: string
    ): Promise<ListingsResponse> {
        try {
            const listings = await em.find(
                Listing,
                { make },
                { orderBy: { price: 'DESC' } }
            );

            const filteredListings = listings.filter((listing) => {
                if (!listing.categories) {
                    return false;
                }
                for (const cat in listing.categories) {
                    if (
                        listing.categories[cat]
                            .toLowerCase()
                            .includes(category.toLowerCase())
                    ) {
                        return true;
                    }
                    // console.log(cat)
                    return false;
                }
            });

            return { data: filteredListings };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    // create a listing
    @Mutation(() => ListingResponse)
    public async createListing(
        @Ctx() { em }: GQLContext,
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
