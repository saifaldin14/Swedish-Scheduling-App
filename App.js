import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Month from './screens/Month'
import Week from './screens/Week'
import Day from './screens/Day'
import Add from './screens/Add'
import Login from './screens/Login'
import Loading from './screens/Loading'

const DrawerNav = createStackNavigator({

  Loading: {
    screen: Loading,
    navigationOptions: () => ({
      title: 'Loading',
      headerBackTitle: null
    }),
  },
  Login: {
    screen: Login,
    navigationOptions: () => ({
      title: 'Login',
      headerBackTitle: null
    }),
  },

  First: {
    screen: Day,
    navigationOptions: () => ({
      title: 'Day',
      headerBackTitle: null
    }),
  },
  Second: {
    screen: Week,
    navigationOptions: () => ({
      title: 'Week',
      headerBackTitle: null
    }),
  },
  Third: {
    screen: Month,
    navigationOptions: () => ({
      title: 'Month',
      headerBackTitle: null
    }),
  },

  Add: {
    screen: Add,
    navigationOptions: () => ({
      title: 'Add',
      headerBackTitle: null
    }),
  }

});
const App = createAppContainer(DrawerNav);
export default App;