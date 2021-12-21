import { Ctx, Mutation, Resolver } from "type-graphql";
import { BooleanWithError } from "./types";


@Resolver()
export class ReverbResolver {

    @Mutation(() => BooleanWithError)
    public async importAllReverbListings(
        @Ctx() { }: any
    ): Promise<BooleanWithError> {
        return { data: true };
    }
}