import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Create OAuth2 client
export function createOAuth2Client(): OAuth2Client {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NODE_ENV === 'production' ? 'https://' : 'http://'}${process.env.NODE_ENV === 'production' ? process.env.HOST : 'localhost:5000'}/api/google/callback`
  );
  
  return oAuth2Client;
}

// Generate authorization URL
export function getAuthUrl(oAuth2Client: OAuth2Client): string {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];
  
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
  
  return authUrl;
}

// Exchange code for tokens
export async function getTokens(oAuth2Client: OAuth2Client, code: string) {
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens;
}

// Get user info
export async function getUserInfo(oAuth2Client: OAuth2Client) {
  const peopleApi = google.people({ version: 'v1', auth: oAuth2Client });
  const response = await peopleApi.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses,names,photos'
  });
  
  return response.data;
}