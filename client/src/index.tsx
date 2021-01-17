import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import reportWebVitals from './reportWebVitals';
import { Listings } from './sections';
import './styles/index.css';

const client = new ApolloClient({ uri: '/api', cache: new InMemoryCache() });

ReactDOM.render(
  <ApolloProvider client={client}>
    <Listings title="Tinyhouse Listings" />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
