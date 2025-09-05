import React from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';
import AppNavigator from './src/navigation/AppNavigator';
import customTheme from './src/theme/customTheme';
import customMapping from './src/theme/customMapping';

const App: React.FC = () => (
  <ApplicationProvider {...eva} theme={{...eva.light, ...customTheme}} customMapping={customMapping}>
    <AppNavigator />
  </ApplicationProvider>
);

export default App;
