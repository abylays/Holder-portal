import axios from 'axios';
import config from "../config";
import LOCAL_STORAGE_KEY from './consts'

const { SDK_ACCESS_TOKEN } = LOCAL_STORAGE_KEY
const { accessApiKey, env } = config
const baseURL = `https://cloud-wallet-api.${env}.affinity-project.org/api/v1`

const cloudWalletApi = axios.create({
  baseURL,
  headers: {
    'Api-Key': accessApiKey,
    'Content-Type': 'application/json',
  },
});

// Set the AUTH token for subsequent requests
cloudWalletApi.interceptors.request.use(req =>
{
  const token = localStorage.getItem(SDK_ACCESS_TOKEN);
  req.headers.Authorization = token ? `Bearer ${token}` : '';
  return req;
});

export const storeSignedVCs = async (data) =>
{
  const response = await cloudWalletApi.post('/wallet/credentials', data);
  return response.data;
};

export const deleteCredential= async(claimID)=>{
    const response = await cloudWalletApi.delete('/wallet/credentials/'+claimID);
    return response;
}

export const getRequestedCredentials = async (data) =>
{
  console.log("api called in apii service")
    const response = await cloudWalletApi.get('/wallet/credentials?credentialShareRequestToken='+data);
    return response.data;
};
export const createSharedResponseToken = async (credentialShareRequestToken,credentials) =>
{
    const response = await cloudWalletApi.post(
        `/wallet/credential-share-token/create-response-token`,
        { credentialShareRequestToken,credentials }
    );
    return response.data;
};

export const getDID=async()=>{
    const response = await cloudWalletApi.get('users/get-did');
    return response.data;
}



export const shareBBSVC = async (id, fieldsToShare) =>
{
  const response = await cloudWalletApi.post(
    `/wallet/credentials/${id}/share`,
    { ttl: '0', fieldsToShare }
  );
  return response.data;
};

export const getSharedCredential = async (url) =>
{
  try {
    const response = await cloudWalletApi.get('/wallet/credentials');
    return response.data;
  } catch (err) {
    if (err.response.data.httpStatusCode.toString().startsWith(4)) {
      alert(err.response.data.message);
    }
    return null;
  }
};

/*export const  storeSignedVCs=async( saveCredentialInput) =>{
    const response = await cloudWalletApi.post(
        `wallet/sign-credential`,
        { unsignedCredential:saveCredentialInput }
    );
    return response.data;
}*/


export const alertWithBrowserConsole= async (consoleMessage, alertMessage) =>{
    if( consoleMessage ) {
        console.log(consoleMessage);
    }

    alert(alertMessage || 'There has been an issue processing your request. Please check the browser console.')
}




export default cloudWalletApi
