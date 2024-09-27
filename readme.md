Certainly! After reevaluating the solution, here's an updated approach that leverages AWS Lambda, Amazon S3, Amazon Athena, and AWS API Gateway to create a platform for tracking the execution status of various AWS services. I'll provide updated code for each component to help you implement this solution effectively.
Updated Solution Overview

    Lambda Functions to Fetch AWS Resources Data:
        Create Lambda functions that use AWS APIs to fetch data about AWS resources (Lambda functions, Step Functions, Glue jobs, etc.).
        Store the fetched data in Parquet format in Amazon S3.

    Set Up Athena Tables to Query S3 Data:
        Define Athena tables that point to the Parquet files stored in S3.
        Use Athena to query and analyze the data.

    Lambda Functions to Query Athena and Return Results:
        Create Lambda functions that execute Athena queries to retrieve the desired information.
        These functions will process the query results and format them as needed.

    API Gateway to Expose Lambda Functions as APIs:
        Set up API Gateway endpoints that invoke the Lambda functions.
        These APIs will provide access to the data for your dashboard or other applications.

    (Optional) Dashboard to Display Data:
        Develop a frontend application to visualize the data retrieved from the APIs.

Component 1: Lambda Functions to Fetch AWS Resources Data
1.1. Lambda Function to Fetch Lambda Functions Status

IAM Role Configuration:

    Ensure the Lambda execution role has permissions to call lambda:list_functions and s3:PutObject.

Lambda Function Code:

python

import boto3
import pandas as pd
import pyarrow.parquet as pq
import pyarrow as pa
import io
from datetime import datetime

def lambda_handler(event, context):
    # Initialize clients
    lambda_client = boto3.client('lambda')
    s3_client = boto3.client('s3')
    
    # Fetch list of Lambda functions
    paginator = lambda_client.get_paginator('list_functions')
    functions = []
    
    for page in paginator.paginate():
        for function in page['Functions']:
            functions.append({
                'FunctionName': function['FunctionName'],
                'Runtime': function.get('Runtime'),
                'Handler': function.get('Handler'),
                'LastModified': function.get('LastModified'),
                'MemorySize': function.get('MemorySize'),
                'Timeout': function.get('Timeout'),
                'State': function.get('State', 'Unknown'),
                'Version': function.get('Version'),
                'Role': function.get('Role')
            })
    
    # Convert to DataFrame
    df = pd.DataFrame(functions)
    
    # Convert DataFrame to Parquet
    table = pa.Table.from_pandas(df)
    buffer = io.BytesIO()
    pq.write_table(table, buffer)
    
    # Define S3 bucket and key
    bucket_name = 'your-s3-bucket-name'
    key = f'aws_data/lambda_status/lambda_status_{datetime.utcnow().strftime("%Y%m%d%H%M%S")}.parquet'
    
    # Upload Parquet file to S3
    s3_client.put_object(Bucket=bucket_name, Key=key, Body=buffer.getvalue())
    
    return {
        'statusCode': 200,
        'body': f'Data uploaded to s3://{bucket_name}/{key}'
    }

Notes:

    Replace 'your-s3-bucket-name' with your actual S3 bucket name.
    The Lambda function fetches all Lambda functions in the account and stores their metadata.

1.2. Lambda Function to Fetch Step Functions Status

IAM Role Configuration:

    Permissions needed: states:list_state_machines, states:list_executions, s3:PutObject.

Lambda Function Code:

python

import boto3
import pandas as pd
import pyarrow.parquet as pq
import pyarrow as pa
import io
from datetime import datetime

def lambda_handler(event, context):
    # Initialize clients
    sf_client = boto3.client('stepfunctions')
    s3_client = boto3.client('s3')
    
    # Fetch list of state machines
    paginator = sf_client.get_paginator('list_state_machines')
    state_machines = []
    
    for page in paginator.paginate():
        for sm in page['stateMachines']:
            executions = sf_client.list_executions(
                stateMachineArn=sm['stateMachineArn'],
                maxResults=10,  # Adjust as needed
                statusFilter='RUNNING'  # You can change this filter
            )
            for exe in executions['executions']:
                state_machines.append({
                    'StateMachineName': sm['name'],
                    'StateMachineArn': sm['stateMachineArn'],
                    'ExecutionArn': exe['executionArn'],
                    'ExecutionName': exe['name'],
                    'StartDate': exe['startDate'].strftime('%Y-%m-%d %H:%M:%S'),
                    'Status': exe['status']
                })
    
    # Convert to DataFrame
    df = pd.DataFrame(state_machines)
    
    # Convert DataFrame to Parquet
    table = pa.Table.from_pandas(df)
    buffer = io.BytesIO()
    pq.write_table(table, buffer)
    
    # Define S3 bucket and key
    bucket_name = 'your-s3-bucket-name'
    key = f'aws_data/stepfunctions_status/stepfunctions_status_{datetime.utcnow().strftime("%Y%m%d%H%M%S")}.parquet'
    
    # Upload Parquet file to S3
    s3_client.put_object(Bucket=bucket_name, Key=key, Body=buffer.getvalue())
    
    return {
        'statusCode': 200,
        'body': f'Data uploaded to s3://{bucket_name}/{key}'
    }

1.3. Lambda Function to Fetch Glue Jobs Status

IAM Role Configuration:

    Permissions needed: glue:get_jobs, glue:get_job_runs, s3:PutObject.

Lambda Function Code:

python

import boto3
import pandas as pd
import pyarrow.parquet as pq
import pyarrow as pa
import io
from datetime import datetime

def lambda_handler(event, context):
    # Initialize clients
    glue_client = boto3.client('glue')
    s3_client = boto3.client('s3')
    
    # Fetch list of Glue jobs
    paginator = glue_client.get_paginator('get_jobs')
    jobs = []
    
    for page in paginator.paginate():
        for job in page['Jobs']:
            # Get recent job runs
            job_runs = glue_client.get_job_runs(JobName=job['Name'], MaxResults=1)
            for run in job_runs['JobRuns']:
                jobs.append({
                    'JobName': job['Name'],
                    'JobRunId': run['Id'],
                    'JobRunState': run['JobRunState'],
                    'StartedOn': run['StartedOn'].strftime('%Y-%m-%d %H:%M:%S'),
                    'LastModifiedOn': job['LastModifiedOn'].strftime('%Y-%m-%d %H:%M:%S')
                })
    
    # Convert to DataFrame
    df = pd.DataFrame(jobs)
    
    # Convert DataFrame to Parquet
    table = pa.Table.from_pandas(df)
    buffer = io.BytesIO()
    pq.write_table(table, buffer)
    
    # Define S3 bucket and key
    bucket_name = 'your-s3-bucket-name'
    key = f'aws_data/glue_status/glue_status_{datetime.utcnow().strftime("%Y%m%d%H%M%S")}.parquet'
    
    # Upload Parquet file to S3
    s3_client.put_object(Bucket=bucket_name, Key=key, Body=buffer.getvalue())
    
    return {
        'statusCode': 200,
        'body': f'Data uploaded to s3://{bucket_name}/{key}'
    }

Scheduler Configuration:

    Use EventBridge (formerly CloudWatch Events) to schedule these Lambda functions to run at regular intervals (e.g., every 15 minutes).

Component 2: Set Up Athena Tables to Query S3 Data

After storing data in S3, set up Athena tables to query the Parquet files.
2.1. Athena Table for Lambda Functions

Athena SQL DDL:

sql

CREATE EXTERNAL TABLE IF NOT EXISTS aws_data.lambda_status (
  FunctionName STRING,
  Runtime STRING,
  Handler STRING,
  LastModified STRING,
  MemorySize INT,
  Timeout INT,
  State STRING,
  Version STRING,
  Role STRING
)
STORED AS PARQUET
LOCATION 's3://your-s3-bucket-name/aws_data/lambda_status/'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

2.2. Athena Table for Step Functions

Athena SQL DDL:

sql

CREATE EXTERNAL TABLE IF NOT EXISTS aws_data.stepfunctions_status (
  StateMachineName STRING,
  StateMachineArn STRING,
  ExecutionArn STRING,
  ExecutionName STRING,
  StartDate STRING,
  Status STRING
)
STORED AS PARQUET
LOCATION 's3://your-s3-bucket-name/aws_data/stepfunctions_status/'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

2.3. Athena Table for Glue Jobs

Athena SQL DDL:

sql

CREATE EXTERNAL TABLE IF NOT EXISTS aws_data.glue_status (
  JobName STRING,
  JobRunId STRING,
  JobRunState STRING,
  StartedOn STRING,
  LastModifiedOn STRING
)
STORED AS PARQUET
LOCATION 's3://your-s3-bucket-name/aws_data/glue_status/'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

Notes:

    Execute these DDL statements in the Athena Query Editor.
    Ensure that the LOCATION points to the correct S3 path where the Parquet files are stored.

Component 3: Lambda Functions to Query Athena and Return Results

Create Lambda functions that execute Athena queries and return the results.
3.1. Common Setup for Athena Queries

IAM Role Configuration:

    Permissions needed: athena:StartQueryExecution, athena:GetQueryExecution, athena:GetQueryResults, s3:PutObject, s3:GetObject, s3:ListBucket.

Lambda Function Code Template:

python

import boto3
import time
import json

athena_client = boto3.client('athena')
s3_output = 's3://your-s3-bucket-name/athena-results/'

def execute_athena_query(query_string, database):
    response = athena_client.start_query_execution(
        QueryString=query_string,
        QueryExecutionContext={'Database': database},
        ResultConfiguration={'OutputLocation': s3_output}
    )
    query_execution_id = response['QueryExecutionId']
    
    # Wait for the query to complete
    status = 'RUNNING'
    while status in ['RUNNING', 'QUEUED']:
        response = athena_client.get_query_execution(QueryExecutionId=query_execution_id)
        status = response['QueryExecution']['Status']['State']
        if status in ['FAILED', 'CANCELLED']:
            raise Exception('Athena query failed or was cancelled')
        time.sleep(1)
    
    # Get query results
    result = athena_client.get_query_results(QueryExecutionId=query_execution_id)
    return result

3.2. Lambda Function to Get Lambda Functions Status

python

def lambda_handler(event, context):
    query = '''
    SELECT FunctionName, State, LastModified
    FROM aws_data.lambda_status
    ORDER BY LastModified DESC
    LIMIT 100
    '''
    database = 'your_database_name'  # Replace with your Athena database name
    result = execute_athena_query(query, database)
    
    # Process result
    rows = []
    for row in result['ResultSet']['Rows'][1:]:  # Skip header
        data = row['Data']
        rows.append({
            'FunctionName': data[0].get('VarCharValue', ''),
            'State': data[1].get('VarCharValue', ''),
            'LastModified': data[2].get('VarCharValue', '')
        })
    
    return {
        'statusCode': 200,
        'body': json.dumps(rows)
    }

3.3. Lambda Function to Get Step Functions Status

python

def lambda_handler(event, context):
    query = '''
    SELECT StateMachineName, ExecutionName, Status, StartDate
    FROM aws_data.stepfunctions_status
    WHERE Status = 'RUNNING'
    ORDER BY StartDate DESC
    LIMIT 100
    '''
    database = 'your_database_name'  # Replace with your Athena database name
    result = execute_athena_query(query, database)
    
    # Process result
    rows = []
    for row in result['ResultSet']['Rows'][1:]:
        data = row['Data']
        rows.append({
            'StateMachineName': data[0].get('VarCharValue', ''),
            'ExecutionName': data[1].get('VarCharValue', ''),
            'Status': data[2].get('VarCharValue', ''),
            'StartDate': data[3].get('VarCharValue', '')
        })
    
    return {
        'statusCode': 200,
        'body': json.dumps(rows)
    }

3.4. Lambda Function to Get Glue Jobs Status

python

def lambda_handler(event, context):
    query = '''
    SELECT JobName, JobRunState, StartedOn
    FROM aws_data.glue_status
    ORDER BY StartedOn DESC
    LIMIT 100
    '''
    database = 'your_database_name'  # Replace with your Athena database name
    result = execute_athena_query(query, database)
    
    # Process result
    rows = []
    for row in result['ResultSet']['Rows'][1:]:
        data = row['Data']
        rows.append({
            'JobName': data[0].get('VarCharValue', ''),
            'JobRunState': data[1].get('VarCharValue', ''),
            'StartedOn': data[2].get('VarCharValue', '')
        })
    
    return {
        'statusCode': 200,
        'body': json.dumps(rows)
    }

Notes:

    Replace 'your_database_name' with the name of your Athena database.
    The execute_athena_query function handles the query execution and waiting for completion.

Component 4: API Gateway to Expose Lambda Functions as APIs

Set up API Gateway to expose these Lambda functions as RESTful APIs.
4.1. Create API Gateway Endpoints

    Endpoint 1: /lambda-status
        Method: GET
        Integration: Lambda function to get Lambda functions status.

    Endpoint 2: /stepfunctions-status
        Method: GET
        Integration: Lambda function to get Step Functions status.

    Endpoint 3: /glue-status
        Method: GET
        Integration: Lambda function to get Glue jobs status.

4.2. Configuration Steps

    Create a New REST API:
        Go to API Gateway console.
        Create a new API named AWSResourcesStatusAPI.

    Add Resources and Methods:
        For each endpoint, add a new resource with a GET method.

    Integrate with Lambda Functions:
        Set the integration type to Lambda Function.
        Choose the corresponding Lambda function.

    Enable CORS (if needed):
        If you plan to call the API from a browser, enable CORS for the methods.

    Deploy the API:
        Deploy the API to a stage (e.g., prod).
        Note the invoke URLs for each endpoint.

4.3. Test the API Endpoints

    Use tools like Postman or curl to test the endpoints.
    The endpoints should return JSON data with the execution statuses.

Component 5: (Optional) Dashboard to Display Data

Develop a frontend application to visualize the data.
Options:

    Web Application:
        Use frameworks like React, Angular, or Vue.js to build a dashboard.
        Fetch data from the API Gateway endpoints.
        Display the data in tables, charts, or graphs.

    Amazon QuickSight:
        If you prefer a managed solution, use Amazon QuickSight to visualize Athena query results.
        QuickSight can connect directly to Athena and create interactive dashboards.

Additional Considerations

    Error Handling:
        Implement error handling in your Lambda functions to manage exceptions and failures.
        Return meaningful error messages via the API.

    Security:
        Secure your APIs using API Keys, AWS IAM Roles, or Cognito User Pools.
        Ensure that sensitive data is protected and only authorized users can access the APIs.

    Performance Optimization:
        Consider caching frequent Athena query results using DynamoDB or ElastiCache for faster response times.
        Be aware of Athena's query execution costs and optimize queries accordingly.

    Automation:
        Use AWS CloudFormation or Terraform to automate the deployment of your infrastructure.

Summary

By using AWS Lambda to fetch resource data and store it as Parquet files in S3, you enable efficient querying through Athena. Exposing the Athena query results via API Gateway allows you to build a customizable platform for tracking AWS resource statuses.



Certainly! Let's create a dashboard in JavaScript that beautifully displays the statuses of your AWS Lambda functions, Step Functions, and Glue jobs. We'll use React for building the frontend, along with Material-UI for styling and Recharts for data visualization. This combination will help us create a modern, responsive, and user-friendly interface.
Overview of the Dashboard

    Framework: React
    Styling: Material-UI
    Data Visualization: Recharts
    Data Fetching: Axios for API calls to AWS API Gateway endpoints
    Components:
        Navigation Tabs for different AWS services
        Data Tables with sorting and filtering
        Charts for visual representation of data
        Responsive layout for different screen sizes

Steps to Create the Dashboard

    Set Up the React Application
    Design the Layout and Navigation
    Create Components for Each AWS Service
    Fetch Data from AWS API Gateway Endpoints
    Display Data in Tables with Advanced Features
    Visualize Data Using Charts
    Apply Styling and Themes
    Implement Error Handling and Loading States
    Make the Dashboard Responsive
    Deploy the Dashboard

Step 1: Set Up the React Application
Initialize the Project

Open your terminal and run:

bash

npx create-react-app aws-dashboard
cd aws-dashboard

Install Dependencies

bash

npm install axios @material-ui/core @material-ui/icons @material-ui/lab recharts material-table

    axios: For making HTTP requests.
    @material-ui: For UI components and styling.
    recharts: For data visualization.
    material-table: For advanced table features.

Step 2: Design the Layout and Navigation
Create a Layout Component

File: src/components/Layout.js

jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab } from '@material-ui/core';

function Layout({ children, currentTab, handleTabChange }) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">AWS Resource Dashboard</Typography>
        </Toolbar>
        <Tabs value={currentTab} onChange={handleTabChange} centered>
          <Tab label="Lambda Functions" />
          <Tab label="Step Functions" />
          <Tab label="Glue Jobs" />
        </Tabs>
      </AppBar>
      <main style={{ padding: 20 }}>{children}</main>
    </>
  );
}

export default Layout;

Step 3: Create Components for Each AWS Service
3.1. Lambda Functions Component

File: src/components/LambdaFunctions.js

jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import { CircularProgress, Typography } from '@material-ui/core';

function LambdaFunctions() {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const apiEndpoint = 'https://your-api-endpoint/lambda-status'; // Replace with your API endpoint

  useEffect(() => {
    axios
      .get(apiEndpoint)
      .then((response) => {
        setFunctions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setLoading(false);
      });
  }, [apiEndpoint]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load data.</Typography>;

  return (
    <MaterialTable
      title="AWS Lambda Functions"
      columns={[
        { title: 'Function Name', field: 'FunctionName' },
        { title: 'Status', field: 'State' },
        { title: 'Last Modified', field: 'LastModified', type: 'datetime' },
      ]}
      data={functions}
      options={{
        sorting: true,
        filtering: true,
        pageSize: 10,
        exportButton: true,
      }}
    />
  );
}

export default LambdaFunctions;

3.2. Step Functions Component

File: src/components/StepFunctions.js

jsx

// Similar structure to LambdaFunctions.js

3.3. Glue Jobs Component

File: src/components/GlueJobs.js

jsx

// Similar structure to LambdaFunctions.js

Step 4: Fetch Data from AWS API Gateway Endpoints

Replace 'https://your-api-endpoint' with the actual endpoints you have set up in API Gateway for each AWS service.

    Lambda Functions Endpoint: https://your-api-endpoint/lambda-status
    Step Functions Endpoint: https://your-api-endpoint/stepfunctions-status
    Glue Jobs Endpoint: https://your-api-endpoint/glue-status

Ensure that your API Gateway allows CORS if you're accessing it from the browser.
Step 5: Display Data in Tables with Advanced Features

We are using material-table for rich table features like sorting, filtering, pagination, and exporting.
Example Features

    Sorting: Click on column headers to sort data.
    Filtering: Use the filter row to filter data based on column values.
    Pagination: Navigate through pages if you have a lot of data.
    Exporting: Export data to CSV or other formats.

Step 6: Visualize Data Using Charts
Add Charts to Visualize Key Metrics

File: src/components/LambdaFunctions.js

Add the following imports:

jsx

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

Add chart data processing in your useEffect:

jsx

useEffect(() => {
  axios
    .get(apiEndpoint)
    .then((response) => {
      setFunctions(response.data);
      setLoading(false);

      // Process data for the chart
      const statusCounts = response.data.reduce((acc, func) => {
        const state = func.State || 'Unknown';
        acc[state] = (acc[state] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.keys(statusCounts).map((state) => ({
        name: state,
        value: statusCounts[state],
      }));

      setChartData(chartData);
    })
    .catch((error) => {
      console.error(error);
      setError(true);
      setLoading(false);
    });
}, [apiEndpoint]);

Render the chart below your table:

jsx

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

return (
  <>
    {/* Existing MaterialTable component */}
    <MaterialTable /* ...props */ />
    <Typography variant="h6" style={{ marginTop: 40 }}>
      Function Status Distribution
    </Typography>
    <PieChart width={400} height={300}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </>
);

Step 7: Apply Styling and Themes
Create a Custom Theme

File: src/theme.js

jsx

import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'light', // You can switch to 'dark' for dark mode
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    secondary: {
      main: '#dc004e', // Customize your secondary color
    },
  },
});

export default theme;

Apply the Theme in Your App

File: src/App.js

jsx

import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Layout from './components/Layout';
import LambdaFunctions from './components/LambdaFunctions';
import StepFunctions from './components/StepFunctions';
import GlueJobs from './components/GlueJobs';

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  let content;
  if (currentTab === 0) {
    content = <LambdaFunctions />;
  } else if (currentTab === 1) {
    content = <StepFunctions />;
  } else {
    content = <GlueJobs />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Layout currentTab={currentTab} handleTabChange={handleTabChange}>
        {content}
      </Layout>
    </ThemeProvider>
  );
}

export default App;

Step 8: Implement Error Handling and Loading States

Ensure that your components handle loading and error states gracefully.

Example in LambdaFunctions.js

jsx

if (loading) {
  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <CircularProgress />
      <Typography variant="h6">Loading data...</Typography>
    </div>
  );
}

if (error) {
  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <Typography variant="h6" color="error">
        Failed to load data. Please try again later.
      </Typography>
    </div>
  );
}

Step 9: Make the Dashboard Responsive

Use Material-UI's Grid system to make your dashboard responsive.

Example

jsx

import { Grid } from '@material-ui/core';

// Inside your component's return statement
return (
  <>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        {/* MaterialTable */}
      </Grid>
      <Grid item xs={12} md={4}>
        {/* PieChart */}
      </Grid>
    </Grid>
  </>
);

Step 10: Deploy the Dashboard
Options for Deployment

    AWS Amplify: Great integration with AWS services.
    Netlify: Easy to use with continuous deployment from Git repositories.
    Vercel: Optimized for frontend frameworks and static sites.

Deploying with AWS Amplify

    Initialize Amplify in Your Project

    bash

npm install -g @aws-amplify/cli
amplify init

Add Hosting

bash

amplify add hosting

Publish Your App

bash

    amplify publish

Enhancements and Best Practices

    Authentication: Secure your API endpoints and dashboard using AWS Cognito or another authentication method.
    Pagination and Performance: Implement server-side pagination if dealing with large datasets.
    Accessibility: Ensure your dashboard is accessible according to WCAG guidelines.
    Unit Testing: Write tests for your components using Jest and React Testing Library.

Summary

By following these steps, you've created a beautiful, responsive, and functional dashboard that displays your AWS resources' execution statuses. The use of React, Material-UI, and Recharts allows for a modern and interactive user experience.
Let Me Know If You Need Further Assistance

Feel free to ask if you need help with:

    Setting up authentication for your dashboard.
    Enhancing data visualization with more complex charts.
    Implementing additional features or optimizing performance.

I'm here to help you make your dashboard as effective and user-friendly as possible!

