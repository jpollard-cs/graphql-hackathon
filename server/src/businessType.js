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
