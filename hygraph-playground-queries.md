# Hygraph Playground Queries

## Check Medical Services

Copy and paste this query into your Hygraph GraphQL Playground:

### Basic Services Query
```graphql
query GetAllMedicalServices {
  medicalServices {
    id
    name
    description {
      text
    }
    keywords
    icon
    featured
    servicesOffered
    commonProcedures {
      text
    }
  }
}
```

### Services with Ordering
```graphql
query GetOrderedMedicalServices {
  medicalServices(orderBy: name_ASC) {
    id
    name
    description {
      text
    }
    keywords
    icon
    featured
    servicesOffered
    commonProcedures {
      text
    }
  }
}
```

### Check Published Services Only
```graphql
query GetPublishedMedicalServices {
  medicalServices(where: { _status: PUBLISHED }) {
    id
    name
    description {
      text
    }
    keywords
    icon
    featured
    servicesOffered
    commonProcedures {
      text
    }
  }
}
```

### Check Draft Services
```graphql
query GetDraftMedicalServices {
  medicalServices(where: { _status: DRAFT }) {
    id
    name
    description {
      text
    }
    keywords
    icon
    featured
    servicesOffered
    commonProcedures {
      text
    }
  }
}
```

### Count Total Services
```graphql
query CountMedicalServices {
  medicalServicesConnection {
    aggregate {
      count
    }
  }
}
```

### Featured Services Only
```graphql
query GetFeaturedServices {
  medicalServices(where: { featured: true }) {
    id
    name
    description {
      text
    }
    keywords
    icon
    featured
    servicesOffered
  }
}
```

## How to Use

1. Go to your Hygraph project dashboard
2. Navigate to "API Playground" or "GraphQL Playground"
3. Copy and paste any of the above queries
4. Click the "Play" button to execute
5. Check the results in the right panel

## Expected Results

If services exist, you should see data like:
```json
{
  "data": {
    "medicalServices": [
      {
        "id": "...",
        "name": "cardiology",
        "description": {
          "text": "Heart and cardiovascular care..."
        },
        "keywords": ["heart", "cardiology", "cardiac"],
        "icon": "Heart",
        "featured": true,
        "servicesOffered": ["ECG Testing", "Heart Monitoring"],
        "commonProcedures": {
          "text": "Diagnostic procedures include..."
        }
      }
    ]
  }
}
```

If no services exist, you'll see:
```json
{
  "data": {
    "medicalServices": []
  }
}
```

## Troubleshooting

- If you get a field error, the schema might be different
- If you get "Cannot query field", the model name might be different
- Check if services are in DRAFT status and need to be published
- Verify you have the correct permissions to read the data