import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Month from './screens/Month'
import Week from './screens/Week'
import Day from './screens/Day'
import Add from './screens/Add'
import Add2 from './screens/Add2'
import Login from './screens/Login'
import Loading from './screens/Loading'
import Passcode from './screens/Passcode'

const DrawerNav = createStackNavigator({

  Passcode: {
    screen: Passcode,
    navigationOptions: () => ({
      title: 'Lösenkod', //Passcode
      headerBackTitle: null
    }),
  },
  Loading: {
    screen: Loading,
    navigationOptions: () => ({
      title: 'Läser In', //Loading
      headerBackTitle: null
    }),
  },
  Login: {
    screen: Login,
    navigationOptions: () => ({
      title: 'Logga In', //Login
      headerBackTitle: null
    }),
  },

  First: {
    screen: Day,
    navigationOptions: () => ({
      title: 'Dag', //Day
      headerBackTitle: null
    }),
  },
  Second: {
    screen: Week,
    navigationOptions: () => ({
      title: 'Vecka', //Week
      headerBackTitle: null
    }),
  },
  Third: {
    screen: Month,
    navigationOptions: () => ({
      title: 'Månad', //Month
      headerBackTitle: null
    }),
  },

  Add: {
    screen: Add,
    navigationOptions: () => ({
      title: 'Lägg Till', //Add
      headerBackTitle: null
    }),
  }

});
const App = createAppContainer(DrawerNav);
export default App;