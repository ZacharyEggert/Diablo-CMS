import { Query, Resolver } from 'type-graphql';

@Resolver()
export class ListingResolver {
    @Query(() => String)
    hello() {
        return 'Hello World!';
    }
}
