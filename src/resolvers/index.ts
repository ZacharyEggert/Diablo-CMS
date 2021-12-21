import { NonEmptyArray } from 'type-graphql';
import { ListingResolver } from './listing.resolver';
import { ReverbResolver } from './reverb.resolver';
import { UserResolver } from './user.resolver';

const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
    ListingResolver,
    UserResolver,
    ReverbResolver
];

export default resolvers;
