// @flow

import {AppRegistry} from 'react-native'
import App from './app'
import codePush from 'react-native-code-push'

// I'm not importing the exported variable because I just want to initialize
// the file here.
import './bugsnag'

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
}

if (process.env.NODE_ENV !== 'production') {
  // essentially disable codepush on dev mode
  codePushOptions = {
    checkFrequency: codePush.CheckFrequency.MANUAL,
    installMode: codePush.InstallMode.ON_NEXT_RESTART,
  }
}

AppRegistry.registerComponent('CARLS', () =>
  codePush(codePushOptions)(App),
)
