import { User } from '@entities/User';
import { GraphQLScalarType } from 'graphql';
import { ClassType, Field, ObjectType } from 'type-graphql';

@ObjectType()
export class GQLError {
    @Field()
    message: string;
    @Field(() => String, { nullable: true })
    field?: string;
    @Field(() => String, { nullable: true })
    code?: string;
}

@ObjectType()
export class UserResponse {
    @Field(() => User, { nullable: true })
    user?: User;
    @Field(() => GQLError, { nullable: true })
    error?: GQLError;
}

@ObjectType()
export class UsersResponse {
    @Field(() => [User], { nullable: true })
    users?: User[];
    @Field(() => GQLError, { nullable: true })
    error?: GQLError;
}

interface IResponseWithError<T> {
    data?: T;
    errors?: GQLError[];
}

export function ResponseWithError<TItem>(
    TItemClass: ClassType<TItem> | GraphQLScalarType | String | Number | Boolean
): ClassType<IResponseWithError<TItem>> {
    @ObjectType({ isAbstract: true })
    class ResponseWithErrorClass {
        @Field(() => TItemClass, { nullable: true })
        data?: TItem;
        @Field(() => [GQLError], { nullable: true })
        errors?: GQLError[];
    }
    return ResponseWithErrorClass;
}

@ObjectType()
export class BooleanWithError extends ResponseWithError(Boolean) { }
