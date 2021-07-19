import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const theme = responsiveFontSizes(
    createMuiTheme({
        palette: {
            /*primary: {
                main: '#FFFFFF',
            }*/
          },
        spacing: 8,
        typography: {
            // Tell Material-UI what's the font-size on the html element is.
            //htmlFontSize: 10,
          },
          background: {
            default: '#EEEEEE',
          },
          breakpoints:{
              values:{
                xs: 0,
                sm: 360, //360
                md: 768, //768
                lg: 1024,
                xl: 1920 //OK
              }
          }
    })
);

export default theme;