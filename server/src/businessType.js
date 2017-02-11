import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
} from 'graphql';

export const coordinateType = new GraphQLObjectType({
    name: 'Coordinate',
    description: 'geocoordinates',
    fields: () => ({
        latitude: {type: GraphQLFloat},
        longitude: {type: GraphQLFloat}
    })
});


export const reviewType = new GraphQLObjectType({
    name: 'Review',
    description: 'review',
    fields: () => ({
        text: {type: GraphQLString},
        rating: {type: GraphQLInt}
    })
});

export const reviewsType = new GraphQLObjectType({
    name: 'Reviews',
    description: 'reviews',
    fields: () => ({
        total: {type: GraphQLInt},
        reviews: {type: new GraphQLList(reviewType), resolve: (reviews) => reviews.reviews}
    })
});


export const businessType = new GraphQLObjectType({
    name: 'Business',
    description: 'Your friendly neighborhood Yelp Business.',
    fields:() => ({
        id: { type: GraphQLString },
        name: {type: GraphQLString},
        price: {type: GraphQLString},
        imageUrl: {type: GraphQLString, resolve: (business) => business.image_url},
        rating: {type: GraphQLInt},
        coordinates: {type: coordinateType, resolve: (business) => business.coordinates},
    })
});

export const reviewsInputType = new GraphQLInputObjectType({
    name: 'ReviewsInput',
    description: 'reviews input',
    fields: () => ({
        id: {type: GraphQLString}
    })
});

export const searchInputType = new GraphQLInputObjectType({
    name: 'SearchInput',
    description: 'search input',
    fields:() => ({
        term: {type: GraphQLString},
        limit: {type: GraphQLInt},
        latitude: {type: GraphQLFloat},
        longitude: {type: GraphQLFloat},
    })
});

export default businessType;
