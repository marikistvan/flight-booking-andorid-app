export interface LocationResponse {
    meta: Meta;
    data: Location[];
}

export interface Meta {
    count: number;
    links: Links;
}

export interface Links {
    self: string;
}

export interface Location {
    type: string;
    subType: string;
    name: string;
    detailedName: string;
    id: string;
    self: SelfLink;
    timeZoneOffset: string;
    iataCode: string;
    geoCode: GeoCode;
    address: Address;
    analytics: Analytics;
}

export interface SelfLink {
    href: string;
    methods: string[];
}

export interface GeoCode {
    latitude: number;
    longitude: number;
}

export interface Address {
    cityName: string;
    cityCode: string;
    countryName?: string;
    countryCode?: string;
    regionCode?: string;
}

export interface Analytics {
    travelers: Travelers;
}

export interface Travelers {
    score: number;
}
