# Configuration



## Full Example

#### **`config/incident.json`**

``` json
{
  "formName": "HPD:Help Desk",
  "requestID": "Entry ID",
  "idField": "Incident Number",
  "priorityField": "Priority",
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
  "dateFormat": "DD.MM.yyyy HH:mm",
  "cardFields": {
    "Summary": "Description",
    "Assigned Group": "Assigned Group",
    "Assignee": "Assignee",
    "Created": "Submit Date"
  },
  "columnField": "Status",
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