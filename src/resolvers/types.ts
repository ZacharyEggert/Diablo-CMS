import { Listing } from '@entities/Listing';
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
interface IResponseWithErrors<T> {
    data?: T;
    errors?: GQLError[];
}
interface IResponseArrayWithErrors<T> {
    data?: T[];
    errors?: GQLError[];
}

export function ResponseWithError<TItem>(
    TItemClass: ClassType<TItem> | GraphQLScalarType | String | Number | Boolean | Array<any>
): ClassType<IResponseWithErrors<TItem>> {
    @ObjectType({ isAbstract: true })
    class ResponseWithErrorClass {
        @Field(() => TItemClass, { nullable: true })
        data?: TItem;
        @Field(() => [GQLError], { nullable: true })
        errors?: GQLError[];
    }
    return ResponseWithErrorClass;
}

export function ResponseArrayWithError<TItem>(
    TItemClass: ClassType<TItem> | GraphQLScalarType | String | Number | Boolean | Array<any>
): ClassType<IResponseArrayWithErrors<TItem>> {
    @ObjectType({ isAbstract: true })
    class ResponseWithErrorClass {
        @Field(() => [TItemClass], { nullable: true })
        data?: TItem[];
        @Field(() => [GQLError], { nullable: true })
        errors?: GQLError[];
    }
    return ResponseWithErrorClass;
}
@ObjectType()
export class BooleanWithError extends ResponseWithError(Boolean) { }

@ObjectType()
export class UserResponse extends ResponseWithError(User) { }

@ObjectType()
export class UsersResponse extends ResponseArrayWithError(User) { }

@ObjectType()
export class ListingResponse extends ResponseWithError(Listing) { }

@ObjectType()
export class ListingsResponse extends ResponseArrayWithError(Listing) { }