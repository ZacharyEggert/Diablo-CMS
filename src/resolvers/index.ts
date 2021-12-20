import { NonEmptyArray } from 'type-graphql';
import { ListingResolver } from './listing.resolver';
import { UserResolver } from './user.resolver';

const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
    ListingResolver,
    UserResolver,
];

export default resolvers;
