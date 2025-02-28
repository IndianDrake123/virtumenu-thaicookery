
# Thai Cookery Analytics Data

This directory stores user interaction data for the Thai Cookery app.

## Data Structure

For each user, a subdirectory is created with the user ID as the folder name.
Inside each user directory, the following files are stored:

1. `interactions.csv` - A CSV file containing all user interactions with the app
   - Timestamp
   - Action type
   - Full event data in JSON format
   
2. `chat_queries.txt` - A text file containing all chat/search queries made by the user
   - Timestamp: Query

## Sample File Structure

```
analytics_data/
├── README.md
├── 1f4a2b3c-8d5e-4f6g-7h8i-9j0k1l2m3n4o/
│   ├── interactions.csv
│   └── chat_queries.txt
├── 5p6q7r8s-9t0u-1v2w-3x4y-5z6a7b8c9d0e/
│   ├── interactions.csv
│   └── chat_queries.txt
└── ...
```

## Data Storage Note

In the browser application, this data is stored in localStorage under the key `thai_cookery_analytics`.
The data can be exported using the utility functions in the analytics.ts file:

```typescript
import { exportAnalyticsToCSV } from '@/utils/analytics';

// Get CSV of all analytics data
const csvData = exportAnalyticsToCSV();
```

For a real production application, this data would be sent to a server-side API endpoint and stored in a database.
