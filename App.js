import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Login from 'screens/Login';
import Main from 'screens/Main';
import { KeepAwake, Font } from 'expo';
import { Root, StyleProvider, Toast } from 'native-base';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import { Alert, AsyncStorage } from 'react-native';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from 'redux/reducers';

const middlewares = [thunk];

if (process.env.NODE_ENV == "development") middlewares.push(createLogger());
let store = createStore(reducer, {}, applyMiddleware(...middlewares));

KeepAwake.activate();

class ExportApp extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
      mainScreen: Login
    };
  }
  componentWillMount() {
    AsyncStorage.getItem("login").then((value) => {
      if (value) {
        this.setState({
          mainScreen: Main
        });
      }
    }).done();
  }
  async componentDidMount() {
    /* Alert.alert(
      'Alert Title',
      'My Alert Msg'
    ); */
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
    });

    this.setState({ fontLoaded: true });
  }
  render() {
    const App = StackNavigator({
      Main: {
        screen: this.state.mainScreen
      },
      MainScreen: {
        screen: Main
      }
    }, {
      initialRouteName: 'Main'
    });
    if (this.state.fontLoaded) {
      return (
        <Root>
          <Provider store={store}>
            <StyleProvider style={getTheme(material)}>
              <App />
            </StyleProvider>
          </Provider>
        </Root>
      );
    }
    return null;
  }
}

export default ExportApp;
