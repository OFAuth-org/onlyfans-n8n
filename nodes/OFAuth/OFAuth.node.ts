import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class OFAuth implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'OFAuth',
    name: 'oFAuth',
    icon: 'file:ofauth.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with OFAuth API',
    defaults: {
      name: 'OFAuth',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'oFAuthApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: 'https://api-next.ofauth.com',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
                  {
                            "name": "Whoami",
                            "value": "whoami"
                  },
                  {
                            "name": "Connections",
                            "value": "connections"
                  },
                  {
                            "name": "Settings",
                            "value": "settings"
                  },
                  {
                            "name": "Self",
                            "value": "self"
                  },
                  {
                            "name": "Earnings",
                            "value": "earnings"
                  },
                  {
                            "name": "Analytics",
                            "value": "analytics"
                  },
                  {
                            "name": "Posts",
                            "value": "posts"
                  },
                  {
                            "name": "Users",
                            "value": "users"
                  },
                  {
                            "name": "Chats",
                            "value": "chats"
                  },
                  {
                            "name": "Mass Messages",
                            "value": "mass_messages"
                  },
                  {
                            "name": "Subscribers",
                            "value": "subscribers"
                  },
                  {
                            "name": "Subscriptions",
                            "value": "subscriptions"
                  },
                  {
                            "name": "Promotions",
                            "value": "promotions"
                  },
                  {
                            "name": "Vault",
                            "value": "vault"
                  }
        ],
        default: 'whoami',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["whoami","connections","settings","self","earnings","analytics","posts","users","chats","mass_messages","subscribers","subscriptions","promotions","vault"],
          },
        },
        options: [
          {
            name: 'Get All',
            value: 'getAll',
            action: 'Get all items',
            routing: {
              request: {
                method: 'GET',
              },
            },
          },
          {
            name: 'Get',
            value: 'get',
            action: 'Get an item',
            routing: {
              request: {
                method: 'GET',
              },
            },
          },
          {
            name: 'Create',
            value: 'create',
            action: 'Create an item',
            routing: {
              request: {
                method: 'POST',
              },
            },
          },
          {
            name: 'Update',
            value: 'update',
            action: 'Update an item',
            routing: {
              request: {
                method: 'PATCH',
              },
            },
          },
          {
            name: 'Delete',
            value: 'delete',
            action: 'Delete an item',
            routing: {
              request: {
                method: 'DELETE',
              },
            },
          },
        ],
        default: 'getAll',
      },
      {
        displayName: 'Connection ID',
        name: 'connectionId',
        type: 'string',
        default: '',
        description: 'Connection ID for access operations',
        displayOptions: {
          show: {
            resource: [],
          },
        },
      },
      {
        displayName: 'Item ID',
        name: 'itemId',
        type: 'string',
        default: '',
        description: 'ID of the item',
        displayOptions: {
          show: {
            operation: ['get', 'update', 'delete'],
          },
        },
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        options: [
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            default: 50,
            description: 'Max number of results to return',
          },
          {
            displayName: 'Offset',
            name: 'offset',
            type: 'number',
            default: 0,
            description: 'Offset for pagination',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('oFAuthApi');
    
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    
    for (let i = 0; i < items.length; i++) {
      try {
        const connectionId = this.getNodeParameter('connectionId', i, '') as string;
        const itemId = this.getNodeParameter('itemId', i, '') as string;
        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
        
        let endpoint = `/v2/access/${resource}`;
        if (itemId && ['get', 'update', 'delete'].includes(operation)) {
          endpoint += `/${itemId}`;
        }
        
        const options: any = {
          method: operation === 'getAll' ? 'GET' : 
                  operation === 'get' ? 'GET' :
                  operation === 'create' ? 'POST' :
                  operation === 'update' ? 'PATCH' : 'DELETE',
          url: endpoint,
          headers: {
            apiKey: credentials.apiKey as string,
          },
          json: true,
        };
        
        if (connectionId) {
          options.headers['x-connection-id'] = connectionId;
        }
        
        if (operation === 'getAll') {
          options.qs = { ...additionalFields };
        }
        
        const response = await this.helpers.httpRequest(options);
        
        if (Array.isArray(response)) {
          returnData.push(...response.map(item => ({ json: item })));
        } else if (response.list) {
          returnData.push(...response.list.map((item: any) => ({ json: item })));
        } else {
          returnData.push({ json: response });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
      }
    }
    
    return [returnData];
  }
}
