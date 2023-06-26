// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // angular setup
  baseUrl: 'https://dev.skyvirt.tech/appci/',
  siteUrl: 'https://dev.skyvirt.tech',
  accessUrl:'https://dev.skyvirt.tech/assessment/assessment/',
  // for node chat

  apiUrl: 'https://devchat.skyvirt.tech/',
  socketUrl: 'https://devchat.skyvirt.tech/'

    // // for node chat
    // apiUrl: 'http://localhost:4000/',
    // socketUrl: 'http://localhost:4000/'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
