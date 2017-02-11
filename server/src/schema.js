import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import { businessType, searchInputType, reviewsType, reviewsInputType } from './businessType';
import Yelp from 'yelp-fusion';
import * as YelpConstants from './constants/yelp';

const formatObjectForPrinting = (o) => JSON.stringify(o, null, 2);

const rootFields = {
  reviews: {
      type: reviewsType,
      args: {
          input: {
              type: reviewsInputType
          }
      },
      resolve: (_, { input }) => {
          return new Promise((resolve, reject) => {
              Yelp.accessToken(YelpConstants.APP_ID, YelpConstants.APP_SECRET).then(response => {
                  const client = Yelp.client(response.jsonBody.access_token);
                  client.reviews(input.id).then(response => {
                      console.log(formatObjectForPrinting(response.jsonBody));
                      resolve(response.jsonBody);
                  }).catch(e => console.log(formatObjectForPrinting(e)));
              }).catch(e => {
                  console.log(formatObjectForPrinting(e));
                  reject(e);
              });
          });
      }
  },
  businesses: {
    type: new GraphQLList(businessType),
    args: {
      input: {
        type: searchInputType
      }
    },
    resolve: (_, request)  => {
      return new Promise((resolve, reject) => {
          Yelp.accessToken(YelpConstants.APP_ID, YelpConstants.APP_SECRET).then(response => {
              const client = Yelp.client(response.jsonBody.access_token);
              client.search(request.input).then(response => {
                  console.log(formatObjectForPrinting(response.jsonBody));
                  resolve(response.jsonBody.businesses);
              }).catch(e => console.log(formatObjectForPrinting(e)));
          }).catch(e => {
              console.log(formatObjectForPrinting(e));
              reject(e);
          });
      });
    }
  }
};

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'QueryRoot',
    fields: {
      ...rootFields
    }
  })
});

export default schema;
