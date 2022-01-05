import { User } from '@entities/User';
import argon2 from 'argon2';
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
            return { data: users };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
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
                    errors: [{
                        message: 'User not found',
                        field: 'ID',
                        code: '404',
                    }],
                };
            }
            return { data: user };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
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

    @Mutation(() => UserResponse)
    public async createUser(
        @Ctx() ctx: GQLContext,
        @Arg('username') username: string,
        @Arg('password') password: string,
        @Arg('email') email: string
    ): Promise<UserResponse> {
        try {
            const userExists = await ctx.em.findOne(User, { username: username.toLowerCase() });
            if (userExists) {
                return {
                    errors: [{
                        message: 'User already exists',
                        field: 'Username',
                        code: '400',
                    }],
                };
            }

            const hashedPassword = await argon2.hash(password);

            const user = new User({
                username: username.toLowerCase(),
                password: hashedPassword,
                email: email.toLowerCase(),
            });
            await ctx.em.persistAndFlush(user);
            return { data: user };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    @Query(() => UserResponse)
    public async me(@Ctx() ctx: GQLContext): Promise<UserResponse> {
        try {

            if (!ctx.req.session || !ctx.req.session!.userId) {
                console.error('No session found', ctx.req.session);
                return {
                    errors: [{
                        message: 'User not found',
                        field: 'ID',
                        code: '404',
                    }],
                };
            }

            const user = await ctx.em.findOne(User, ctx.req.session.userId);
            if (!user) {
                return {
                    errors: [{
                        message: 'User not found',
                        field: 'ID',
                        code: '404',
                    }],
                };
            }
            return { data: user };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    @Mutation(() => UserResponse)
    public async login(
        @Ctx() ctx: GQLContext,
        @Arg('username') username: string,
        @Arg('password') password: string
    ): Promise<UserResponse> {
        try {

            const user = await ctx.em.findOne(User, { username: username.toLowerCase() });
            if (!user) {
                return {
                    errors: [{
                        message: 'User not found',
                        field: 'ID',
                        code: '404',
                    }],
                };
            }

            const isValid = await argon2.verify(user.password, password);
            if (!isValid) {
                return {
                    errors: [{
                        message: 'Invalid password',
                        field: 'Password',
                        code: '400',
                    }],
                };
            }


            ctx.req.session.userId = user.id;
            ctx.req.session.loggedIn = true;
            return { data: user };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

    @Mutation(() => BooleanWithError)
    public async logout(@Ctx() ctx: GQLContext): Promise<BooleanWithError> {
        try {
            ctx.req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                    return {
                        errors: [{
                            message: 'Error logging out',
                            field: 'Logout',
                            code: '500',
                        }],
                    };
                }
            });

            return { data: true };
        } catch (e) {
            console.error(e);
            const { message } = e as Error;
            return { errors: [{ message, field: 'SQL' }] };
        }
    }

}
