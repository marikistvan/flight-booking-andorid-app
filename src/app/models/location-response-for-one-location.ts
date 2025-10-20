export interface LocationResponseForOneLocation {
    meta: {
        links: {
            self: string;
        };
    };
    data: LocationData;
}

export interface LocationData {
    type: string;
    subType: string;
    name: string;
    detailedName: string;
    id: string;
    self: {
        href: string;
        methods: string[];
    };
    timeZoneOffset: string;
    iataCode: string;
    geoCode: {
        latitude: number;
        longitude: number;
    };
    address: {
        cityName: string;
        cityCode: string;
        countryName: string;
        countryCode: string;
        regionCode: string;
    };
    analytics: {
        travelers: {
            score: number;
        };
    };
}
