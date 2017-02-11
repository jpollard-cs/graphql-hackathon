import React, { PropTypes, Component } from 'react';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import './App.css';

import GoogleMap from 'google-map-react';

const Layout = ({ children }) => (
  <div>{ children }</div>
);

// Replace this Uri with your GraphQL server Uri
const serverUri = 'http://localhost:5000/graphql';

const plumber = {
  position: 'relative',
  background: 'url(./src/img/plumber.png)',
  backgroundSize: 'contain',
  width: '30px',
  height: '30px'
};

const plumberName = {
  position: 'absolute',
  top: '-30px',
  left: 0,
  fontSize: '14px'
}

class Plumber extends Component {
  static propTypes = {
    text: PropTypes.string
  };

  render() {
    return (
      <div>
        <div style={plumber}>
          <p style={plumberName}>{this.props.text}</p>
        </div>
      </div>
    );
  }
}

class Drawer extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    console.log(this.props)

    return (
      <div style={
        {
          transition: 'width 0.5s ease',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '100vh',
          background: 'mediumorchid'
        }
      }>
        <PlumberDetails id={this.props.id} />
      </div>
    )
  }
}

const PlumberDetails = graphql(gql`
   query BookSearchQuery($id: String!) {
    business(input: {
      id: $id
    }){
      id
    }
  }
`, {
  // These params come from React Router's URL pattern
  options: ({ id }) => {
    return { variables: { id: id } }
  },
})(({ data: { loading, plumber } }) => {
  if (loading || !plumber) {
    return <div>Loading</div>;
  } else {
    return (
      <div>
        <h3>{plumber.name}</h3>
        <h4>Reviews</h4>
        <ul>
        { plumber.reviews.map(({ text, rating }) => {
          <li>{text} <b>{rating}</b></li>
        })}
        </ul>        
      </div>
    );
  }
});

const MapContainer = graphql(gql`
  query BookSearchQuery {
    businesses(input: {
      term: "plumber",
      latitude: 42.360,
      longitude: -71.3,
      limit: 10
    }){
      id,
      coordinates {
        latitude
        longitude
      },
      name
    }
  }
`, {
  options: ({ keyword }) => ({ variables: { keyword } }),
})((props) => {

  const { data: { loading, businesses }, onClick } = props;

  console.log(props);

  return (
    <GoogleMap
      style={null}
      bootstrapURLKeys={{
        key: 'AIzaSyA877dUOx8E9Pt0wAaFUjULuKUGEiVJ8RM',
        language: 'en'
      }}
      defaultCenter={{lat: 42.360, lng: -71.0}}
      defaultZoom={11}
      onChildClick={onClick}
    >
      {loading ? [] : businesses.map(({ id, coordinates, name }) => {
        return <Plumber key={id} lat={coordinates.latitude} lng={coordinates.longitude} text={name} />
      })}
    </GoogleMap>
  )
});


class Wrapper extends Component {
  constructor(...args) {
    super(...args);

    this.handlePlumberClick = this.handlePlumberClick.bind(this)

    this.state = {
      open: false,
      id: null
    }
  }

  handlePlumberClick (id) {
    this.setState({
      id: id,
      open: !this.state.open
    })
  }

  render() {
    return (
      <div>
        <MapContainer keyword={''} onClick={this.handlePlumberClick} />
        {
          this.state.open &&
          <Drawer id={this.state.id} />
        }
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
        <Wrapper/>
      </ApolloProvider>
    );
  }
}

export default App;
