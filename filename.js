import axios from 'axios';

const tenantId = 'c942c308-0364-4808-a6fe-d4d798456570';
const clientId = '406d9acb-69c9-4436-9fd8-2a3f3a196315'; // replace with your application (client) id
const clientSecret = 'bd376c4b-6fa4-45a1-b4d8-5bd376893c7d'; // replace with your client secret

const postData = {
  client_id: clientId,
  scope: 'https://graph.microsoft.com/.default',
  client_secret: clientSecret,
  grant_type: 'client_credentials',
};

const axiosConfig = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

axios
  .post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, new URLSearchParams(postData), axiosConfig)
  .then((res) => {
    console.log(`Access Token: ${res.data.access_token}`);
  })
  .catch((error) => {
    console.error(error);
  });
