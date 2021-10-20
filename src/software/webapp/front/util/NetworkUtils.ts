import {OptionsObject, SnackbarKey, SnackbarMessage, VariantType} from "notistack";

/*
    MyoCoach frontend networking utility class
    ==========================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
export default class NetworkUtils {

    static manageResult(result: Response, onResponse: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) {
        if(result.status >= 400) {
            let variant: VariantType = 'error';
            onResponse(result.statusText, { variant });
        } else {
            result.json().then((response: SystemCommandActionResponse) => {
                let variant: VariantType = (response.result == 0) ? 'success' : 'warning';
                onResponse(response.message, { variant });
            });
        }
    }

}