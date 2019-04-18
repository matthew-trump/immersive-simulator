// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  server: {
    url: "http://localhost:8089",
    apiPath: "/api/",
    loginPath: "/login",
    configPath: "/api/config",

  },
  allowCustomStage: true,
  customStageDefault: true,
  users: [
    {
      name: "Test User Alpha",
      id: "test-user-alpha",
      lastSeen: (new Date()).toISOString(),
      locale: 'en-US'
    },
    {
      name: "Test User Beta",
      id: "test-user-beta",
      lastSeen: null,
      locale: 'en-US'
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
