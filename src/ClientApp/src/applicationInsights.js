import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  instrumentationKey: 'de0f6cbd-181a-4293-9803-299505b0d058',
  disableFetchTracking: false,
  loggingLevelConsole: 2, //Riportare a 0
  enableDebug: true, //rimuoverre
  loggingLevelTelemetry: 2, //rimuovere
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
//appInsights.trackPageView();

export default appInsights;