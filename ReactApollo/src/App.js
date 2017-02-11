import React, { PropTypes, Component } from 'react';
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


const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: 40,
  height: 40,
  left: -40 / 2,
  top: -40 / 2,

  border: '5px solid #f44336',
  borderRadius: 40,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4
};

class MyGreatPlace extends Component {
  static propTypes = {
    text: PropTypes.string
  };

  render() {
    return (
      <div style={greatPlaceStyle}>
        {this.props.text}
      </div>
    );
  }
}

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
        <GoogleMap
          style={null}
          bootstrapURLKeys={{
            key: 'AIzaSyA877dUOx8E9Pt0wAaFUjULuKUGEiVJ8RM',
            language: 'en'
          }}
          defaultCenter={{lat: 42.360, lng: -71.0}}
          defaultZoom={9}
        >
            <MyGreatPlace lat={59.955413} lng={30.337844} text="blah"/>
        </GoogleMap>
    </ApolloProvider>
    );
  }
}

export default App;
