import { Connection, IDatabaseDriver, EntityManager } from '@mikro-orm/core';
import { ReverbApiClient } from '@zacharyeggert/reverb-api';
import { Request, Response } from 'express';
import { Session } from 'express-session';

export type GQLContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: RequestOverload;
    res: Response;
    rc: ReverbApiClient;
};

export type SessionOverload = Session & {
    userId?: number;
    loggedIn?: boolean;
    [key: string]: any;
}

export type RequestOverload = Request & {
    session?: SessionOverload;
};

export interface ReverbListing {
    id: number;
    make: string;
    model: string;
    finish: string;
    year: string;
    title: string;
    created_at: string;
    shop_name: string;
    description: string;
    condition: Condition;
    price: Price;
    inventory: number;
    has_inventory: boolean;
    offers_enabled: boolean;
    auction: boolean;
    categories: Category[];
    listing_currency: Currency;
    published_at: string;
    buyer_price: BuyerPrice;
    sku: string;
    seller_price: Price;
    state: State;
    shipping_profile_id: number;
    shipping: Shipping;
    stats: Stats;
    slug: string;
    photos: Photo[];
    _links: ReverbListingLinks;
}

export interface ReverbListingLinks {
    photo: href;
    self: href;
    update: hrefWithMethod;
    bump: hrefWithMethod;
    end: hrefWithMethod;
    want: hrefWithMethod;
    unwant: hrefWithMethod;
    edit: href;
    web: href;
    make_offer: hrefWithMethod;
    add_to_wishlist: hrefWithMethod;
    remove_from_wishlist: hrefWithMethod;
    cart: href;
}

export interface hrefWithMethod {
    method: string;
    href: string;
}

export interface href {
    href: string;
}

export interface BuyerPrice {
    amount: string;
    amount_cents: number;
    currency: Currency;
    symbol: Symbol;
    display: string;
    tax_included_hint: string;
    tax_included: boolean;
    tax_included_rate: number;
}

export enum Currency {
    USD = "USD",
}

export enum Symbol {
    USD = "$",
}

export interface Category {
    uuid: string;
    full_name: string;
}

export interface Condition {
    uuid: string;
    display_name: string;
    description: string;
}

export interface Photo {
    _links: PhotoLinks;
}

export interface PhotoLinks {
    large_crop: href;
    small_crop: href;
    full: href;
    thumbnail: href;
}

export interface Price {
    amount: string;
    amount_cents: number;
    currency: Currency;
    symbol: Symbol;
    display: string;
}

export interface Shipping {
    local: boolean;
    rates: UserRegionRateElement[];
    user_region_rate: UserRegionRateElement;
    initial_offer_rate: InitialOfferRate;
    free_expedited_shipping: boolean;
}

export interface InitialOfferRate {
    region_code: string;
    rate: InitialOfferRateRate;
    carrier_calculated: boolean;
    destination_postal_code_needed: boolean;
}

export interface InitialOfferRateRate {
    original: Price;
    display: Price;
}

export interface UserRegionRateElement {
    region_code: string;
    rate: Price;
    carrier_calculated: boolean;
    destination_postal_code_needed: boolean;
}

export interface State {
    slug: string;
    description: string;
}

export interface Stats {
    views: number;
    watches: number;
}
