import log from 'loglevel';
import { authProvider } from '../authProvider';

const _logger = log.getLogger("apiUtils");


/**
 * @token {string} - Bearer token da inserire nell'oggetto config di Axios
 */
async function addBearerToken(config = {}) {
    _logger.debug(`addBearerToken->Acquiring Access Token() - AuthenticationState = ${authProvider.authenticationState}`);
    let customHeaders = config?.headers ?? {};
    if (authProvider.authenticationState !== 'Authenticated') {
        _logger.debug(`addBearerToken->User not authenticated`);
        return {};
    }
    try {
        const token = await authProvider.getAccessToken();
        //_logger.debug(`addBearerToken->Token acquired: ${JSON.stringify(token)}`);
        customHeaders['Authorization'] = `Bearer ${token.accessToken}`;
        //Non sono sicuro che venga fatto il merge degli headers
    } catch (e) {
        _logger.error(`Errore durante il recupero dell'Access Token - ${e}`);
    }
    //_logger.debug(`addBearerToken->RETURN: ${JSON.stringify(result)}`);
    let result = Object.assign({}, config, { headers: customHeaders });
    return result;
}

class APICallException {

    constructor(apiName, message, error) {
        this.apiName = apiName;
        this.message = message;
        this.error = error;
    }
}

export const APIUtils = {
    addBearerToken,
    APICallException
}