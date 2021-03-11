import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, ApolloLink, InMemoryCache, useMutation, HttpLink, concat } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout, Affix, Spin } from 'antd';
import { StripeProvider, Elements } from 'react-stripe-elements';
import reportWebVitals from './reportWebVitals';
import { Home, Host, Listing, Listings, NotFound, User, Login, AppHeader, Stripe } from './sections';
import { Viewer } from './lib/types';
import { LOG_IN } from './lib/graphql/mutations';
import { LogIn as LogInData, LogInVariables } from './lib/graphql/mutations/LogIn/__generated__/LogIn';
import { AppHeaderSkeleton, ErrorBanner } from './lib/components';
import './styles/index.css';

const httpLink = new HttpLink({ uri: '/api' });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      'X-CSRF-TOKEN': sessionStorage.getItem('token') || null,
    },
  });

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [isLoginCompleted, setIsLoginCompleted] = useState<boolean>(false);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if (data.logIn.token) {
          sessionStorage.setItem('token', data.logIn.token);
        } else {
          sessionStorage.removeItem('token');
        }

        setIsLoginCompleted(true);
      }
    },
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching Tinyhouse" />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null;

  const switchElement = isLoginCompleted ? (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/host" render={(props) => <Host {...props} viewer={viewer} />} />
      <Route
        exact
        path="/listing/:id"
        render={(props) => (
          <Elements>
            <Listing {...props} viewer={viewer} />
          </Elements>
        )}
      />
      <Route exact path="/listings/:location?" component={Listings} />
      <Route exact path="/login" render={(props) => <Login {...props} setViewer={setViewer} />} />
      <Route exact path="/user/:id" render={(props) => <User {...props} viewer={viewer} setViewer={setViewer} />} />
      <Route exact path="/stripe" render={(props) => <Stripe {...props} viewer={viewer} setViewer={setViewer} />} />
      <Route component={NotFound} />
    </Switch>
  ) : null;

  return (
    <StripeProvider apiKey={process.env.REACT_APP_S_PUBLISHABLE_KEY as string}>
      <Router>
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Layout id="app">
          {logInErrorBannerElement}
          {switchElement}
        </Layout>
      </Router>
    </StripeProvider>
  );
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
