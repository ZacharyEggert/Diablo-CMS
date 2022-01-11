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

    // get all listings sorted by a given field
    @Query(() => ListingsResponse)
    public async listingsByField(
        @Ctx() { em }: GQLContext,
        @Arg('field', { defaultValue: "price" }) field: "price" | "title" | "imagesImport" | "make" | "status" | "category" | "createdAt" | "updatedAt",
        @Arg('order', { defaultValue: 'DESC' }) order: 'ASC' | 'DESC'
    ): Promise<ListingsResponse> {
        try {
            let mappedField: keyof Listing | 'createdAt' | 'updatedAt';
            switch (field) {
                case 'imagesImport':
                    mappedField = 'reverbImagesImported';
                    break;
                case 'status':
                    mappedField = 'reverbImagesImported';
                    break;
                case 'category':
                    mappedField = 'categories';
                    break;
                default:
                    mappedField = field;
            }

            const listings = await em.find(
                Listing, {},
                { orderBy: { [mappedField]: order ?? 'DESC' } }
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

    // get multiple listings by slug
    @Query(() => ListingsResponse)
    public async listingsBySlugs(
        @Ctx() { em }: GQLContext,
        @Arg('slugs', () => [String]) slugs: string[]
    ): Promise<ListingsResponse> {
        try {
            const listings = await em.find(
                Listing,
                { slug: { $in: slugs } },
                { orderBy: { price: 'DESC' } }
            );
            return { data: listings };
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
        @Ctx() { em, req }: GQLContext,
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

        const { loggedIn } = req.session;

        if (!loggedIn) {
            return {
                errors: [{
                    message: 'Cannot create listings without logging in',
                    field: 'LoggedIn',
                    code: '403',
                }],
            };
        }

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
        @Ctx() { em, req }: GQLContext,
        @Arg('id', () => Int) id: number
    ): Promise<BooleanWithError> {

        const { loggedIn } = req.session;

        if (!loggedIn) {
            return {
                errors: [{
                    message: 'Cannot delete listings without logging in',
                    field: 'LoggedIn',
                    code: '403',
                }],
            };
        }

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

    //update a listing
    @Mutation(() => ListingResponse)
    public async updateListing(
        @Ctx() { em, req }: GQLContext,
        @Arg('id', () => Int) id: number,
        @Arg('title', { nullable: true }) title?: string,
        @Arg('make', { nullable: true }) make?: string,
        @Arg('model', { nullable: true }) model?: string,
        @Arg('description', { nullable: true }) description?: string,
        @Arg('price', { nullable: true }) price?: number,
        @Arg('cost', { nullable: true }) cost?: number,
        @Arg('imageUrls', () => [String], { nullable: true }) photos?: string[],
        @Arg('submodel', { nullable: true }) submodel?: string,
        @Arg('year', { nullable: true }) year?: string,
        @Arg('finish', { nullable: true }) finish?: string,
        @Arg('categories', () => [String], { nullable: true }) categories?: string[],
        @Arg('salePrice', { nullable: true }) salePrice?: number,
        @Arg('isSold', { nullable: true }) isSold?: boolean,
        @Arg('isFeatured', { nullable: true }) isFeatured?: boolean,

    ): Promise<ListingResponse> {

        const { loggedIn } = req.session;

        if (!loggedIn) {
            return {
                errors: [{
                    message: 'Cannot update listings without logging in',
                    field: 'LoggedIn',
                    code: '403',
                }],
            };
        }

        try {
            const listing = await em.findOne(Listing, { id });
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
            if (title) {
                listing.title = title;
            }
            if (make) {
                listing.make = make;
            }
            if (model) {
                listing.model = model;
            }
            if (description) {
                listing.description = description;
            }
            if (price) {
                listing.price = price;
            }
            if (cost) {
                listing.cost = cost;
            }
            if (photos) {
                listing.photos = photos;
            }
            if (submodel) {
                listing.submodel = submodel;
            }
            if (year) {
                listing.year = year;
            }
            if (finish) {
                listing.finish = finish;
            }
            if (categories) {
                listing.categories = categories;
            }
            if (salePrice) {
                listing.salePrice = salePrice;
            }
            if (isSold) {
                listing.isSold = isSold;
            }
            if (isFeatured) {
                listing.isFeatured = isFeatured;
            }
            await em.flush();
            return { data: listing };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }


    //delete all listings
    @Mutation(() => BooleanWithError)
    public async deleteAllListings(
        @Ctx() { em, req }: GQLContext
    ): Promise<BooleanWithError> {

        const { loggedIn } = req.session;

        if (!loggedIn) {
            return {
                errors: [{
                    message: 'Cannot delete listings without logging in',
                    field: 'LoggedIn',
                    code: '403',
                }],
            };
        }

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
