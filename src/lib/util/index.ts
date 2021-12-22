import { Listing } from '@entities/Listing';

const createMapFromListings = (listings: Listing[]) => {
    const map = new Map();
    for (const listing of listings) {
        map.set(listing.reverbId, listing);
    }
    return map;
};

export { createMapFromListings };
