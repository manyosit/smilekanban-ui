# Configuration

# General

## formName
``` js
"formName":"HPD:Help Desk"
```

## requestID
The name of the field that contains the Request ID of the record. It is the field with the field id *1* of the form. This field might be different from the field that is shown to the user as id field. It is needed for the api calls. 
``` js
"requestID":"Entry ID"
```

## idField
The field that contains the id that is shown to the user. 

``` js
"idField":"Incident Number"
```
## priorityField
The name of the field that contains the priority of the record.

``` js
"priorityField":"priorityField"
```

## columnField
The name of the field that is used to group cards into columns.

``` js
"columnField":"Status"
```
## dateFormat

``` js
"dateFormat": "DD.MM.yyyy HH:mm",
``` 

# Cards 
## header

``` js
"columnField"="Status"
```

## cardFields

# Columns

Columns define which values from the column field will be used to group cards by. For a kanban board that show incidents these columns could be the different status values of the ticket. You can decide to only define a subset of columns. Records with undefined values in the columnField will then be ignored and not shown.
``` js
{
  "Assigned": {},
  "In Progress": {},
  "Pending": {},
  "Resolved": {},
  "Cancelled": {},
  "Closed": {}
}
```


``` js
{
  "Pending": {
    "allowedStatus": ["In Progress","Assigned","Cancelled"],
    "fields": [...],
    "fieldConstants": {"Status_Reason": null},
    "worklogs": true
  }
}
```

## allowedStatus

## fields

```
"fields": [
  {
    "id": "Status_Reason",
    "name": "Status Reason",
    "type": "select",
    "menuValues": [
      {
        "label": "Customer Follow-Up Required",
        "value": 15000
      },{
        "label": "Client Hold",
        "value": 13000
      },
     {
       "label": "Monitoring Incident",
       "value": 14000
     }
   ],
   "required":true
  }
]
```

### id
The name of field on the Remedy form.
```js
"id": "Status_Reason"
```

### name
The label of field on the kanban board.
```js
"name": "Status Reason"
```

### type
The type of the field. Allowed values are:

* text
* select

```js
"type": "select"
```

### menuValues
Select fields contain either static or dynamic field values. Static values are defined as Array of label/value pairs. 
```js
"menuValues": [
  {
    "label": "Customer Follow-Up Required",
    "value": 15000
  },{
    "label": "Client Hold",
    "value": 13000
  },
  {
    "label": "Monitoring Incident",
    "value": 14000
  }
]
```

### query
A query can be defined to dynamically create the menuValues.
```js
"query": "'Support Group ID' = \"${Assigned Group ID}\""
```

### form
The form used to query the menu values.
```js
"form": "CTM:Support Group Association"
```

### labelField
For select fields with dynamic queries the value of this field is used as label in the card. 
```js
"labelField": "Full Name"
```

### valueField
For select fields with dynamic queries the value of this field is used as value for the update of the record.
```js
"valueField": "Login ID"
```

### valueTarget

```js
"valueTarget": "Assignee Login ID"
```

### labelTarget
```js
"labelTarget": "Assignee"
```

### required
Whether this field is required or not to save the record.
``` js
"required":true
```

### hidden
Whether this field is shown on the card or not.
``` js
"hidden":true
```

## fieldConstants
An object that lets set constant values in the record whenever a card is dropped.

``` js
"fieldConstants": {
  "Status_Reason": 2700
}
```

## worklogs
Boolean valued that defines whether the worklog fields are shown if a card is dropped on this column.
``` js
"worklogs":true
```

# Searchfilter

## Filter
``` js
{
  "name": "Assigned to me",
  "query": "'Assignee Login ID' = \"${userId}\""
}
```

## Keywords

### simple keywords

### dynamic groups

# Assignee

# Worklogs

# Actions

# Full Example

#### **`config/incident.json`**

``` js
{
  "formName": "HPD:Help Desk",
  "requestID": "Entry ID",
  "idField": "Incident Number",
  "priorityField": "Priority",
  "columnField": "Status",
  "dateFormat": "DD.MM.yyyy HH:mm",
  "header": {
    "titleField": "Incident Number",
    "tagField": "Priority",
    "tagColorMapping": {
      "Critical": "red",
      "High": "orange",
      "Medium": "gold",
      "Low": "green",
      "default": "blue"
    },
    "columnCountColor": "orange"
  },
  "cardFields": {
    "Summary": "Description",
    "Assigned Group": "Assigned Group",
    "Assignee": "Assignee",
    "Created": "Submit Date"
  },
  "filter": [
    {
      "name": "Assigned to me",
      "query": "'Assignee Login ID' = \"${userId}\""
    },
    {
      "name": "Assigned to my groups",
      "query": "'Assigned Group ID' = \"${myGroups}\""
    }
  ],
  "keywords": {
    "userId": {
      "query": "${user.profile.name}"
    },
    "myGroups": {
      "form":"CTM:Support Group Association",
      "joinOperator": "OR",
      "formQuery": "'Login ID' =\"${user.profile.name}\"",
      "formField": "Support Group ID"
    }

  },
  "columns": {
    "Assigned": {
      "fields": [
        {
          "id": "Assigned Support Company",
          "name": "Support Company",
          "type": "select",
          "form": "CTM:Support Group",
          "query": "'Status' = 1 AND 'Vendor Group'=1",
          "labelField": "Company",
          "valueField": "Company",
          "required":true
        },
        {
          "id": "Assigned Support Organization",
          "name": "Support Organization",
          "type": "select",
          "form": "CTM:Support Group",
          "labelField": "Support Organization",
          "valueField": "Support Organization",
          "query": "'Status' = 1 AND 'Vendor Group'=1 AND 'Company' = \"${Assigned Support Company}\"",
          "required":true
        },

        {
          "id": "Assigned Group",
          "name": "Support Group Name",
          "type": "select",
          "form": "CTM:Support Group",
          "labelField": "Support Group Name",
          "valueField": "Support Group ID",
          "valueTarget": "Assigned Group ID",
          "labelTarget": "Assigned Group",
          "query": "'Status' = 1 AND 'Vendor Group'=1 AND 'Company' = \"${Assigned Support Company}\" AND 'Support Organization'=\"${Assigned Support Organization}\" ",
          "required":true
        },
        {
          "id": "Assignee",
          "name": "Assignee",
          "type": "select",
          "form": "CTM:Support Group Association",
          "labelField": "Full Name",
          "valueField": "Login ID",
          "valueTarget": "Assignee Login ID",
          "labelTarget": "Assignee",
          "query": "'Support Group ID' = \"${Assigned Group ID}\""
        },

        {
          "id": "Assignee Login ID",
          "name": "Assignee Login ID",
          "type": "text",
          "hidden": true

        },
        {
          "id": "Assigned Group ID",
          "name": "Assigned Group ID",
          "type": "text",
          "hidden": true

        }
      ],
      "fieldConstants": {"Status_Reason": null},
      "allowedStatus": ["In Progress","Pending","Cancelled"],
      "worklogs": true
    },
    "In Progress": {
      "fields": [
        {
          "id": "Assignee",
          "name": "Assignee",
          "type": "select",
          "form": "CTM:Support Group Association",
          "labelField": "Full Name",
          "valueField": "Login ID",
          "valueTarget": "Assignee Login ID",
          "labelTarget": "Assignee",
          "query": "'Support Group ID' = \"${Assigned Group ID}\""
        },

        {
          "id": "Assignee Login ID",
          "name": "Assignee Login ID",
          "type": "text",
          "hidden": true
        }
      ,

        {
          "id": "Assigned Group ID",
          "name": "Assignee Login ID",
          "type": "text",
          "hidden": true

        }
      ],
      "allowedStatus": ["In Progress","Pending","Cancelled","Resolved","Assigned"]
    },
    "Pending": {
      "allowedStatus": ["In Progress","Cancelled","Assigned"],
      "fields": [
        {
          "id": "Status_Reason",
          "name": "Status Reason",
          "type": "select",
          "menuValues": [
                    {
                      "label": "Customer Follow-Up Required",
                      "value": 15000
                    },{
                      "label": "Client Hold",
                      "value": 13000
                    },
                    {
                      "label": "Monitoring Incident",
                      "value": 14000
                    }
          ],
          "required":true
        }
      ]
    },
    "Resolved": {
      "fields": [
        {
          "id": "Status_Reason",
          "name": "Status Reason",
          "type": "select",
          "menuValues": [
            {
              "label": "Temporary Corrective Action",
              "value": 16000
            },{
              "label": "No Further Action Required",
              "value": 17000
            },{
              "label": "A miracle has happened",
              "value": 1900
            }
          ],
          "required":true
        },
        {
          "id": "Resolution",
          "name": "Resolution",
          "type": "text",
          "required":true
        }



      ],
      "allowedStatus": ["Assigned","Cancelled"]
    },
    "Cancelled": {
      "allowedStatus":[]
    },
    "Closed": {
      "allowedStatus":[]
    }
  },
  "Assignee": {
    "field": "Assignee",
    "action": {
      "type": "fieldUpdate",
      "fields": [
        {
          "id": "Assigned Support Company",
          "name": "Support Company",
          "type": "select",
          "form": "CTM:Support Group",
          "query": "'Status' = 1 AND 'Vendor Group'=1",
          "labelField": "Company",
          "valueField": "Company",
          "required":true
        },
        {
          "id": "Assigned Support Organization",
          "name": "Support Organization",
          "type": "select",
          "form": "CTM:Support Group",
          "labelField": "Support Organization",
          "valueField": "Support Organization",
          "query": "'Status' = 1 AND 'Vendor Group'=1 AND 'Company' = \"${Assigned Support Company}\"",
          "required":true
        },

        {
          "id": "Assigned Group",
          "name": "Support Group Name",
          "type": "select",
          "form": "CTM:Support Group",
          "labelField": "Support Group Name",
          "valueField": "Support Group ID",
          "valueTarget": "Assigned Group ID",
          "labelTarget": "Assigned Group",
          "query": "'Status' = 1 AND 'Vendor Group'=1 AND 'Company' = \"${Assigned Support Company}\" AND 'Support Organization'=\"${Assigned Support Organization}\" ",
          "required":true
        },
        {
          "id": "Assignee",
          "name": "Assignee",
          "type": "select",
          "form": "CTM:Support Group Association",
          "labelField": "Full Name",
          "valueField": "Login ID",
          "valueTarget": "Assignee Login ID",
          "labelTarget": "Assignee",
          "query": "'Support Group ID' = \"${Assigned Group ID}\""
        },

        {
          "id": "Assignee Login ID",
          "name": "Assignee Login ID",
          "type": "text",
          "hidden": true

        },
        {
          "id": "Assigned Group ID",
          "name": "Assigned Group ID",
          "type": "text",
          "hidden": true

        }
      ],
      "fieldConstants": {"Status": "Assigned"},
      "worklogs": true
    }
  },
  "worklogs": {
    "form": "HPD:WorkLog",
    "idField": "Incident Number",
    "worklogRelId": "Incident Number",
    "constants": {
      "Secure Work Log": 1,
      "Work Log Type": 8000,
      "Description": "Kanban Worklog. Status Change: Assigned",
      "Short Description": "Kanban Worklog"

    },
    "fields": [

      {
        "id": "Detailed Description",
        "name": "Notes",
        "type": "textArea",
        "rows": 7

      },

      {
        "id": "View Access",
        "name": "View Access",
        "type": "radio",
        "required": true,
        "options": [
          {
            "label": "Internal",
            "value": 0
          },{
            "label": "Public",
            "value": 1
          }
        ],
        "optionType":"button"
      }
    ],
    "displayFields": {"text": "Detailed Description","date": "Work Log Submit Date","submitter": "Work Log Submitter"}
  },
  "actions": {


    "Open in SmartIT": {
      "type": "open",
      "url":"https://smartit-2002.port.manyos.io/smartit/app/#/incident/${InstanceId}"
    },
    "meine tolle Aktion": {
      "type": "fieldUpdate",
      "fields": [

        {
          "id": "Assignee",
          "name": "Assignee",
          "type": "select",
          "form": "CTM:Support Group Association",
          "labelField": "Full Name",
          "valueField": "Login ID",
          "valueTarget": "Assignee Login ID",
          "labelTarget": "Assignee",
          "query": "'Support Group ID' = \"${Assigned Group ID}\""
        },

        {
          "id": "Assignee Login ID",
          "name": "Assignee Login ID",
          "type": "text",
          "hidden": true

        },
        {
          "id": "Assigned Group ID",
          "name": "Assigned Group ID",
          "type": "text",
          "hidden": true

        }
      ],
      "fieldConstants": {"Status": "Assigned"}
    }

  }
}
```