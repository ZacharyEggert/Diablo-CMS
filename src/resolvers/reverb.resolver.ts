import { GQLContext } from "src/types";
import { Ctx, Mutation, Resolver } from "type-graphql";
import { BooleanWithError } from "./types";
import fs from "fs";
import path from "path";
import { ROOTDIRNAME } from "../constants";

@Resolver()
export class ReverbResolver {

    @Mutation(() => BooleanWithError)
    public async importAllReverbListings(
        @Ctx() { rc }: GQLContext
    ): Promise<BooleanWithError> {

        console.time('getAllReverbListings');
        const allReverbListings = await rc.getMyListings();
        console.timeEnd('getAllReverbListings');

        fs.writeFileSync(path.join(ROOTDIRNAME + '/../testing/allReverbListings.json'), JSON.stringify(allReverbListings, null, 2));

        return { errors: [{ message: 'Not implemented yet' }] };
    }

    @Mutation(() => BooleanWithError)
    public async importRecentReverbListings(
        @Ctx() { rc }: GQLContext
    ): Promise<BooleanWithError> {

        console.time('getRecentReverbListings');
        const RecentReverbListings = await rc.getMyListingsRecent();
        console.timeEnd('getRecentReverbListings');

        fs.writeFileSync(ROOTDIRNAME + '/../testing/RecentReverbListings.json', JSON.stringify(RecentReverbListings, null, 2));

        return { errors: [{ message: 'Not implemented yet' }] };
    }
}