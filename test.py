import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from datetime import datetime, timezone
import boto3
import json

# Get required arguments
args = getResolvedOptions(sys.argv, [
    'JOB_NAME',
    'bucket_name',    # S3 bucket name
    'folder_path'     # Folder path in bucket (optional)
])

def get_job_history(glue_client, job_name):
    """Get the last 5 execution details for a job"""
    try:
        runs = glue_client.get_job_runs(
            JobName=job_name,
            MaxResults=5
        )['JobRuns']
        
        history = []
        for run in runs:
            history.append({
                'status': run['JobRunState'],
                'start_time': run['StartedOn'].strftime('%Y-%m-%d %H:%M:%S UTC'),
                'duration': str(run.get('ExecutionTime', 'N/A')) + ' seconds' if 'ExecutionTime' in run else 'N/A',
                'error': run.get('ErrorMessage', '')
            })
        return history
    except Exception as e:
        print(f"Error getting job history: {str(e)}")
        return []

def get_job_last_run(glue_client, job_name):
    """Get the last execution details for a job"""
    try:
        runs = glue_client.get_job_runs(
            JobName=job_name,
            MaxResults=1
        )['JobRuns']
        
        if runs:
            last_run = runs[0]
            return {
                'start_time': last_run['StartedOn'].strftime('%Y-%m-%d %H:%M:%S UTC'),
                'status': last_run['JobRunState'],
                'duration': str(last_run.get('ExecutionTime', 'N/A')) + ' seconds' if 'ExecutionTime' in run else 'N/A'
            }
        return "No execution history"
    except Exception as e:
        print(f"Error getting last run: {str(e)}")
        return "No execution history"

def get_trigger_schedule(glue_client, job_name):
    """Get schedule for a job from its triggers"""
    try:
        triggers = glue_client.get_triggers()['Triggers']
        for trigger in triggers:
            if 'Actions' in trigger:
                for action in trigger['Actions']:
                    if 'JobName' in action and action['JobName'] == job_name:
                        if 'Schedule' in trigger:
                            return trigger['Schedule']
        return "No schedule found"
    except Exception as e:
        print(f"Error getting trigger schedule: {str(e)}")
        return "No schedule found"

def generate_history_bars(history):
    """Generate HTML for history visualization bars"""
    bars_html = '<div class="history-bars">'
    
    for run in history:
        status = run['status']
        if status == 'SUCCEEDED':
            class_name = 'bar-succeeded'
        elif status == 'FAILED':
            class_name = 'bar-failed'
        elif status == 'RUNNING':
            class_name = 'bar-running'
        else:
            class_name = 'bar-unknown'
            
        tooltip = (f"Status: {status}\\n"
                  f"Time: {run['start_time']}\\n"
                  f"Duration: {run['duration']}")
        if 'error' in run and run['error']:
            tooltip += f"\\nError: {run['error']}"
            
        bars_html += f'''
            <div class="history-bar {class_name}"
                 data-tooltip="{tooltip}">
            </div>
        '''
    
    # Fill empty bars if less than 5 runs
    for _ in range(5 - len(history)):
        bars_html += '''
            <div class="history-bar bar-unknown"
                 data-tooltip="No data available">
            </div>
        '''
    
    bars_html += '</div>'
    return bars_html

def generate_html_report(jobs_data):
    """Generate enhanced HTML report with modern styling"""
    # Your existing generate_html_report function remains unchanged
    # (It's quite long, so I'm not duplicating it here)
    # The function is correctly defined in your original code
    return html  # Returns the generated HTML content

def main():
    # Initialize Glue context
    sc = SparkContext()
    glueContext = GlueContext(sc)
    job = Job(glueContext)
    job.init(args['JOB_NAME'], args)
    
    try:
        bucket_name = args['bucket_name']
        folder_path = args.get('folder_path', '').strip('/')  # Remove leading/trailing slashes
        
        glue_client = boto3.client('glue')
        s3_client = boto3.client('s3')
        
        print(f"Starting ETL monitoring job with parameters:")
        print(f"Bucket: {bucket_name}")
        print(f"Folder: {folder_path}")
        
        # Process all Glue jobs
        print("Fetching Glue jobs...")
        jobs = glue_client.get_jobs()['Jobs']
        job_details = []
        
        total_jobs = len(jobs)
        print(f"Found {total_jobs} jobs to process")
        
        for index, job in enumerate(jobs, 1):
            job_name = job['Name']
            print(f"Processing job {index}/{total_jobs}: {job_name}")
            
            try:
                schedule = get_trigger_schedule(glue_client, job_name)
                last_run = get_job_last_run(glue_client, job_name)
                history = get_job_history(glue_client, job_name)
                
                job_info = {
                    'job_name': job_name,
                    'schedule': schedule,
                    'last_execution': last_run,
                    'history': history,
                    'job_type': job.get('Command', {}).get('Name', 'N/A'),
                    'glue_version': job.get('GlueVersion', 'N/A')
                }
                job_details.append(job_info)
                
            except Exception as e:
                print(f"Error processing job {job_name}: {str(e)}")
                continue
        
        # Generate report files
        timestamp = datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')
        
        # Prepare file paths
        html_key = f"{folder_path}/reports/html/etl_monitor_{timestamp}.html" if folder_path else f"reports/html/etl_monitor_{timestamp}.html"
        latest_html_key = f"{folder_path}/reports/html/latest.html" if folder_path else "reports/html/latest.html"
        json_key = f"{folder_path}/reports/json/etl_monitor_{timestamp}.json" if folder_path else f"reports/json/etl_monitor_{timestamp}.json"
        latest_json_key = f"{folder_path}/reports/json/latest.json" if folder_path else "reports/json/latest.json"
        
        # Generate and upload reports
        print("Generating reports...")
        html_content = generate_html_report(job_details)
        json_data = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'total_jobs': len(job_details),
            'jobs': job_details
        }
        
        # Upload to S3
        print(f"Uploading reports to S3 bucket: {bucket_name}")
        
        # Upload HTML reports
        for key, content in [(html_key, html_content), (latest_html_key, html_content)]:
            s3_client.put_object(
                Bucket=bucket_name,
                Key=key,
                Body=content,
                ContentType='text/html',
                CacheControl='no-cache'
            )
        
        # Upload JSON reports
        json_content = json.dumps(json_data, indent=2)
        for key in [json_key, latest_json_key]:
            s3_client.put_object(
                Bucket=bucket_name,
                Key=key,
                Body=json_content,
                ContentType='application/json',
                CacheControl='no-cache'
            )
        
        print("\nReport generation completed successfully!")
        print(f"Reports saved to:")
        print(f"- s3://{bucket_name}/{html_key}")
        print(f"- s3://{bucket_name}/{latest_html_key}")
        print(f"- s3://{bucket_name}/{json_key}")
        print(f"- s3://{bucket_name}/{latest_json_key}")
            
    except Exception as e:
        print(f"Error in main execution: {str(e)}")
        raise e
    
    job.commit()

if __name__ == '__main__':
    main()
