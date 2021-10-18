import createTheme from "@mui/material/styles/createTheme";

/*
    MyoCoach frontend custom theme for light mode
    =============================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const lightTheme = createTheme({
    spacing: 8,
    palette: {
        primary: {
            main: "#eff5f7"
        },
        secondary: {
            main: "#1b4350",
        },
        success: {
            main: "#00916b"
        },
        info: {
            main: "#00a9e0",
            light: "#95d3ea99",
        },
        warning: {
            main: "#ffc600",
            light: "#ffcd1a",
            dark: "#e6b400",
        },
        error: {
            main: "#ff6d14",
            light: "#fbaf8499",
        },
        mode: "light",
    },
    typography: {
        h5: {
            fontFamily: "Montserrat-Bold",
        },
        body1: {
            fontFamily: "Montserrat",
        },
        body2: {
            fontFamily: "Montserrat-Bold",
            fontSize: "1rem",
            lineHeight: 1.5,
            letterSpacing: "0.00938em",
        },
        button: {
            fontFamily: "Montserrat-Bold",
        },
        subtitle1: {
            fontFamily: "Montserrat-Italic",
            fontSize: "1rem",
            lineHeight: 1.5,
            letterSpacing: "0.00938em",
        },
        subtitle2: {
            fontFamily: "Montserrat-BoldItalic",
            fontSize: "1rem",
            lineHeight: 1.5,
            letterSpacing: "0.00938em",
        },
        overline: {
            fontFamily: "Montserrat",
            fontSize: "0.75rem",
            lineHeight: 2.66,
            letterSpacing: "0.08333em",
        },
        caption: {
            fontFamily: "Montserrat",
            fontSize: "0.7rem",
            letterSpacing: "0.08333em",
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @font-face {
                    font-family: 'Montserrat';
                    font-style: normal;
                    font-weight: normal;
                    src: url('../../public/fonts/Montserrat/Montserrat-Regular.ttf') format('truetype');
                    unicode-range:
                       'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF';
                }
                
                @font-face {
                    font-family: 'Montserrat-Bold';
                    font-style: normal;
                    font-weight: bold;
                    src: url('../../public/fonts/Montserrat/Montserrat-Bold.ttf') format('truetype');
                    unicode-range:
                        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF';
                }
                
                @font-face {
                    font-family: 'Montserrat-Italic';
                    font-style: italic;
                    font-weight: normal;
                    src: url('../../public/fonts/Montserrat/Montserrat-Italic.ttf') format('truetype');
                    unicode-range:
                        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF';
                }
                
                @font-face {
                    font-family: 'Montserrat-BoldItalic';
                    font-style: italic;
                    font-weight: bold;
                    src: url('../../public/fonts/Montserrat/Montserrat-BoldItalic.ttf') format('truetype');
                    unicode-range:
                        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF';
                }
            `,
        },
    },
});

export default lightTheme;
