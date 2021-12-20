import { User } from '@entities/User';
import { GQLContext } from 'src/types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import {
    BooleanWithError,
    ResponseWithError,
    UserResponse,
    UsersResponse,
} from './types';

@Resolver()
export class UserResolver {
    @Query(() => UsersResponse)
    public async users(@Ctx() ctx: GQLContext): Promise<UsersResponse> {
        try {
            const users = await ctx.em.find(User, {});
            return { users };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { error: { message, field: 'SQL' } };
        }
    }

    @Query(() => UserResponse)
    public async user(
        @Ctx() ctx: GQLContext,
        @Arg('id', () => Int) id: number
    ): Promise<UserResponse> {
        try {
            const user = await ctx.em.findOne(User, id);
            if (!user) {
                return {
                    error: {
                        message: 'User not found',
                        field: 'ID',
                        code: '404',
                    },
                };
            }
            return { user };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { error: { message, field: 'SQL' } };
        }
    }

    @Mutation(() => BooleanWithError)
    public async deleteUser(
        @Ctx() ctx: GQLContext,
        @Arg('id', () => Int) id: number
    ): Promise<BooleanWithError> {
        try {
            const user = await ctx.em.findOne(User, id);
            if (!user) {
                return { data: false };
            }
            await ctx.em.removeAndFlush(user);
            return { data: true };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }
}
