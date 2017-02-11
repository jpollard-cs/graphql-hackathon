import React, { Component } from 'react';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import './App.css';

import BookSearch from './BookSearch';
import BookDetails from './BookDetails';
import GoogleMap from 'google-map-react';

const Layout = ({ children }) => (
  <div>{ children }</div>
);

// Replace this Uri with your GraphQL server Uri
const serverUri = 'http://localhost:5000/graphql';


class App extends Component {
  constructor(...args) {
    super(...args);

    const networkInterface = createNetworkInterface({
      uri: serverUri,
      opts: { cors: true },
    });

    this.client = new ApolloClient({
      networkInterface,

      // Our backend has unique IDs, so we should use them for cache consistency
      dataIdFromObject: r => r.id,
    });
  }
  render() {
    return (
      <ApolloProvider client={this.client}>
        <div >
          <GoogleMap
            style={{
              margin: 0,
              padding: 0,
              flex: 1
            }}
            bootstrapURLKeys={{
              key: 'AIzaSyA877dUOx8E9Pt0wAaFUjULuKUGEiVJ8RM',
              language: 'en'
            }}
            defaultCenter={{lat: 59.938043, lng: 30.337157}}
            defaultZoom={9}
          />
        </div>
    </ApolloProvider>
    );
  }
}

export default App;
