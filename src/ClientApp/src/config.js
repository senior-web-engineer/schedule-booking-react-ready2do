export default  {
    MockedAPI: false,
    //APIServer: "https://localhost:44346",
    APIServer: "https://ready2doapi.azurewebsites.net",
    BaseAPIPath: "https://ready2doapi.azurewebsites.net/api",
    //BaseAPIPath: "https://localhost:44346/api",
    AzureB2COptions: {
        auth: {
          //authority: 'https://login.microsoftonline.com/tfp/ready2do.onmicrosoft.com/B2C_1_SigninSignup',
          authority: 'https://ready2do.b2clogin.com/ready2do.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SigninSignup',
          clientId: '2f7c5099-8cf6-4cc3-a601-6e8afdac86f7',
          //redirectUri: 'https://localhost:44343/'
            redirectUri: 'https://ready2do.azurewebsites.net'
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: true
        }
      },
      AzureB2CAuthenticationParameters: {
        scopes: [
          'https://ready2do.onmicrosoft.com/api/api_all'
        ]
    },
    GoogleAPI:{
      MapsKey:"AIzaSyB3QBIUnHrigeqjjnEmwZn717ixOCcMYUw",
      Libraries: ['places']
    }
}
