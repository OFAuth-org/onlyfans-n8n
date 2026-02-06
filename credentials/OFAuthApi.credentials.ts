import {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class OFAuthApi implements ICredentialType {
  name = 'oFAuthApi';
  displayName = 'OFAuth API';
  documentationUrl = 'https://docs.ofauth.com';
  
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'Connection ID',
      name: 'connectionId',
      type: 'string',
      default: '',
      description: 'Default connection ID for access operations',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        apiKey: '={{$credentials.apiKey}}',
      },
    },
  };
}
