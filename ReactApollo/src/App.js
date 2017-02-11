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
  background: 'url(./src/img/plumber.png)',
  backgroundSize: 'contain',
  width: '30px',
  height: '30px'
};

class Plumber extends Component {
  static propTypes = {
    text: PropTypes.string
  };

  render() {
    return (
      <div>
        <div style={plumber}>
          {this.props.text}
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
      </div>
    )
  }
}

const PlumberDetails = graphql(gql`
  query BookDetailsQuery($bookId: String!) {
    bookByID(id: $bookId) {
      id
      title
      image
      description
      author {
        id
        name
      }
    }
  }
`, {
  // These params come from React Router's URL pattern
  options: ({ bookId }) => {
    return { variables: { bookId } }
  },
})(({ data: { loading, bookByID } }) => {
  if (loading || !bookByID) {
    return <div>Loading</div>;
  } else {
    return (
      <div>
        <h3>{bookByID.title}</h3>
        <p>By {bookByID.author.name}</p>
        <p>{bookByID.description}</p>
        <img src={bookByID.image} role="presentation"/>
      </div>
    );
  }
});

const MapContainer = graphql(gql`
  query BookSearchQuery($keyword: String!) {
    bookSearch(keyword: $keyword) {
      id
      image
      title
      author {
        id
        name
      }
    }
  }
`, {
  options: ({ keyword }) => ({ variables: { keyword } }),
})(({ data: { loading, bookSearch }, onClick }) => {
  return (
    <GoogleMap
      style={null}
      bootstrapURLKeys={{
        key: 'AIzaSyA877dUOx8E9Pt0wAaFUjULuKUGEiVJ8RM',
        language: 'en'
      }}
      defaultCenter={{lat: 42.360, lng: -71.0}}
      defaultZoom={9}
      onChildClick={onClick}
    >
      {loading ? [] : bookSearch.map((book) => {
        return <Plumber key={book.id} lat={42.955413} lng={-71.337844} text="blah" />
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
