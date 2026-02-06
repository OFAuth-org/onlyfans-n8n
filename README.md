# OFAuth n8n Node

n8n community node for the OFAuth API. Automate your OnlyFans workflows with n8n's powerful workflow automation.

## Overview

This n8n node allows you to interact with the OFAuth API directly from n8n workflows:
- Access creator profile and earnings data
- Manage posts, messages, and subscribers
- Handle vault and media operations
- Create promotions and tracking links

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Click **Install a community node**
3. Enter `n8n-nodes-ofauth`
4. Click **Install**

### Manual Installation

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-ofauth
```

Restart n8n after installation.

## Authentication

1. In n8n, go to **Credentials**
2. Click **Add Credential**
3. Search for "OFAuth API"
4. Enter your OFAuth API key
5. Click **Save**

## Available Resources

| Resource | Description |
|----------|-------------|
| **Whoami** | Account information |
| **Connections** | Connection management |
| **Settings** | Account settings |
| **Self** | Creator profile |
| **Earnings** | Earnings data and analytics |
| **Analytics** | Posts, stories, streams analytics |
| **Posts** | Post management |
| **Users** | User operations |
| **Chats** | Chat and messaging |
| **Mass Messages** | Mass messaging |
| **Subscribers** | Subscriber data |
| **Subscriptions** | Subscription management |
| **Promotions** | Promotions and links |
| **Vault** | Vault media management |

## Operations

Each resource supports these operations (where applicable):

| Operation | Description |
|-----------|-------------|
| **Get All** | List all items |
| **Get** | Get a single item by ID |
| **Create** | Create a new item |
| **Update** | Update an existing item |
| **Delete** | Delete an item |

## Usage

### Basic Setup

1. Add the **OFAuth** node to your workflow
2. Select your OFAuth credentials
3. Choose a **Resource** (e.g., Self, Posts, Earnings)
4. Choose an **Operation** (e.g., Get All, Create)
5. Enter the **Connection ID** for access operations
6. Configure additional fields as needed

### Connection ID

Most operations require a Connection ID to specify which OnlyFans account to use:

- Get the Connection ID from the Connections resource
- Or use a dynamic value from a previous node

### Example: Get Creator Profile

1. Add OFAuth node
2. Resource: **Self**
3. Operation: **Get**
4. Connection ID: `conn_xxx`

### Example: List Recent Posts

1. Add OFAuth node
2. Resource: **Posts**
3. Operation: **Get All**
4. Connection ID: `conn_xxx`
5. Additional Fields:
   - Limit: `20`

### Example: Get Earnings Data

1. Add OFAuth node
2. Resource: **Earnings**
3. Operation: **Get**
4. Connection ID: `conn_xxx`

## Pagination

For list operations, use the **Additional Fields** to control pagination:

| Field | Description |
|-------|-------------|
| **Limit** | Maximum number of results (default: 50) |
| **Offset** | Starting position for results |

## Example Workflows

### Daily Earnings Report

```
Schedule Trigger → OFAuth (Get Earnings) → Slack (Send Message)
```

Sends a daily earnings summary to Slack.

### New Subscriber Welcome

```
OFAuth (New Subscriber) → OFAuth (Send Message)
```

Automatically sends a welcome message to new subscribers.

### Export Posts to Airtable

```
OFAuth (Get All Posts) → Airtable (Create Records)
```

Syncs all posts to an Airtable base.

### Content Analytics Dashboard

```
Schedule Trigger → OFAuth (Get Analytics) → Google Sheets (Update)
```

Updates a Google Sheets dashboard with analytics data.

## Node Configuration

### Credentials

```json
{
  "apiKey": "your-ofauth-api-key"
}
```

### Request Defaults

- **Base URL:** `https://api-next.ofauth.com`
- **Content-Type:** `application/json`
- **Accept:** `application/json`

## Development

### Project Structure

```
packages/n8n/
├── index.ts              # Main exports
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript config
├── credentials/
│   └── OFAuthApi.credentials.ts
└── nodes/
    └── OFAuth/
        ├── OFAuth.node.ts    # Main node definition
        └── ofauth.svg        # Node icon
```

### Building

```bash
cd packages/n8n
npm install
npm run build
```

### Local Testing

1. Build the node
2. Link to your local n8n installation:
   ```bash
   npm link
   cd ~/.n8n/nodes
   npm link n8n-nodes-ofauth
   ```
3. Restart n8n

### Adding New Resources

1. Add the resource to the `resource` options in `OFAuth.node.ts`
2. Add to the `displayOptions.show.resource` array for operations
3. Add any resource-specific fields

## API Reference

The node uses the OFAuth v2 API. For full API documentation:

- **API Docs:** https://api.ofauth.com/docs
- **Developer Portal:** https://docs.ofauth.com

## Troubleshooting

### "Connection ID required"

Most access operations require a Connection ID. Make sure to:
1. First use the Connections resource to list available connections
2. Use the Connection ID in subsequent operations

### "Authentication failed"

Verify your API key:
1. Check the API key in your OFAuth dashboard
2. Update the credential in n8n
3. Test with a simple Whoami operation

### "Rate limit exceeded"

The OFAuth API has rate limits. Add a **Wait** node between operations if needed.

## Support

- **n8n Community:** https://community.n8n.io
- **OFAuth Docs:** https://docs.ofauth.com
- **OFAuth Support:** support@ofauth.com

## License

MIT
