
'use strict';

import {
  StackNavigator,
} from 'react-navigation';
import OrdersList from './OrdersList';
import OrderView from './OrderView';

const App = StackNavigator({
  Home: { screen: OrdersList },
  Order: { screen: OrderView },
});
export default App;
