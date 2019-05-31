import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Month from './screens/Month'
import Week from './screens/Week'
import Day from './screens/Day'
import Add from './screens/Add'

const DrawerNav = createStackNavigator({
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