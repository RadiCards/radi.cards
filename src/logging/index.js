import Vue from 'vue'
import VueLogger from 'vuejs-logger'

let loggingConfig = {
  logLevel: 'debug', // required ['debug', 'info', 'warn', 'error', 'fatal']
  stringifyArguments: true, // optional : defaults to false if not specified
  showLogLevel: true, // optional : defaults to false if not specified
  showMethodName: true, // optional : defaults to false if not specified
  separator: '|', // optional : defaults to '|' if not specified
  showConsoleColors: true // optional : defaults to false if not specified
};

export default Vue.use(VueLogger, loggingConfig);
