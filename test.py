import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from datetime import datetime, timezone
import boto3
import json

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
    except Exception:
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
                'duration': str(last_run.get('ExecutionTime', 'N/A')) + ' seconds' if 'ExecutionTime' in last_run else 'N/A'
            }
        return "No execution history"
    except Exception:
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
    except Exception:
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
    
    # Calculate summary statistics
    total_jobs = len(jobs_data)
    succeeded_jobs = sum(1 for job in jobs_data 
                        if isinstance(job['last_execution'], dict) 
                        and job['last_execution']['status'] == 'SUCCEEDED')
    failed_jobs = sum(1 for job in jobs_data 
                     if isinstance(job['last_execution'], dict) 
                     and job['last_execution']['status'] == 'FAILED')
    running_jobs = sum(1 for job in jobs_data 
                      if isinstance(job['last_execution'], dict) 
                      and job['last_execution']['status'] == 'RUNNING')
    
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ETL Jobs Dashboard</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            :root {
                --primary-color: #2563eb;
                --success-color: #16a34a;
                --danger-color: #dc2626;
                --warning-color: #ca8a04;
                --background-color: #f1f5f9;
                --card-background: #ffffff;
                --text-primary: #1e293b;
                --text-secondary: #64748b;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                background-color: var(--background-color);
                color: var(--text-primary);
                line-height: 1.6;
            }

            .dashboard {
                max-width: 1400px;
                margin: 0 auto;
                padding: 2rem;
            }

            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }

            .title {
                font-size: 1.8rem;
                font-weight: 600;
                color: var(--text-primary);
            }

            .timestamp {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            .stat-card {
                background: var(--card-background);
                padding: 1.5rem;
                border-radius: 0.75rem;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s;
            }

            .stat-card:hover {
                transform: translateY(-2px);
            }

            .stat-header {
                display: flex;
                align-items: center;
                margin-bottom: 1rem;
            }

            .stat-icon {
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 1rem;
            }

            .stat-value {
                font-size: 1.8rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }

            .stat-label {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .jobs-table {
                background: var(--card-background);
                border-radius: 0.75rem;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }

            .table-container {
                overflow-x: auto;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            th {
                text-align: left;
                padding: 1rem;
                background: var(--primary-color);
                color: white;
                font-weight: 500;
            }

            td {
                padding: 1rem;
                border-bottom: 1px solid #e2e8f0;
            }

            tr:hover {
                background-color: #f8fafc;
            }

            .status-badge {
                padding: 0.375rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.875rem;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
            }

            .status-badge i {
                margin-right: 0.5rem;
            }

            .status-succeeded {
                background-color: #dcfce7;
                color: var(--success-color);
            }

            .status-failed {
                background-color: #fee2e2;
                color: var(--danger-color);
            }

            .status-running {
                background-color: #e0f2fe;
                color: var(--primary-color);
            }

            .status-unknown {
                background-color: #f3f4f6;
                color: var(--text-secondary);
            }

            .history-bars {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .history-bar {
                width: 8px;
                height: 24px;
                border-radius: 2px;
                position: relative;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .history-bar:hover {
                transform: scaleY(1.2);
            }

            .history-bar:hover::before {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                padding: 8px;
                background: #1e293b;
                color: white;
                border-radius: 4px;
                font-size: 0.75rem;
                white-space: pre-line;
                z-index: 1000;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                min-width: 200px;
            }

            .history-bar:hover::after {
                content: '';
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 6px solid transparent;
                border-top-color: #1e293b;
            }

            .bar-succeeded {
                background-color: var(--success-color);
            }

            .bar-failed {
                background-color: var(--danger-color);
            }

            .bar-running {
                background-color: var(--primary-color);
            }

            .bar-unknown {
                background-color: var(--text-secondary);
            }

            @media (max-width: 768px) {
                .dashboard {
                    padding: 1rem;
                }
                
                .stats-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="dashboard">
            <div class="header">
                <h1 class="title">ETL Jobs Dashboard</h1>
                <div class="timestamp">
                    Last updated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="background-color: #e0f2fe;">
                            <i class="fas fa-layer-group" style="color: var(--primary-color);"></i>
                        </div>
                    </div>
                    <div class="stat-value">{total_jobs}</div>
                    <div class="stat-label">Total Jobs</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="background-color: #dcfce7;">
                            <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                        </div>
                    </div>
                    <div class="stat-value">{succeeded_jobs}</div>
                    <div class="stat-label">Succeeded</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="background-color: #fee2e2;">
                            <i class="fas fa-times-circle" style="color: var(--danger-color);"></i>
                        </div>
                    </div>
                    <div class="stat-value">{failed_jobs}</div>
                    <div class="stat-label">Failed</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="background-color: #fef9c3;">
                            <i class="fas fa-sync" style="color: var(--warning-color);"></i>
                        </div>
                    </div>
                    <div class="stat-value">{running_jobs}</div>
                    <div class="stat-label">Running</div>
                </div>
            </div>

            <div class="jobs-table">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Job Name</th>
                                <th>Status</th>
                                <th>Last Run</th>
                                <th>Duration</th>
                                <th>Schedule</th>
                                <th>Last 5 Runs</th>
                            </tr>
                        </thead>
                        <tbody>
    """

    for job in sorted(jobs_data, key=lambda x: x['job_name']):
        last_exec = job['last_execution']
        if isinstance(last_exec, dict):
            status = last_exec['status']
            last_run_time = last_exec['start_time']
            duration = last_exec['duration']

            if status == 'SUCCEEDED':
                status_class = 'status-succeeded'
                status_icon = 'check-circle'
            elif status == 'FAILED':
                status_class = 'status-failed'
                status_icon = 'times-circle'
            elif status == 'RUNNING':
                status_class = 'status-running'
                status_icon = 'sync fa-spin'
            else:
                status_class = 'status-unknown'
                status_icon = 'question-circle'
        else:
            status = "NO DATA"
            status_class = 'status-unknown'
            status_icon = 'question-circle'
            last_run_time = "Never"
            duration = "N/A"

        history_bars = generate_history_bars(job.get('history', []))

        html += f"""
                            <tr>
                                <td>{job['job_name']}</td>
                                <td>
                                    <span class="status-badge {status_class}">
                                        <i class="fas fa-{status_icon}"></i>
                                        {status}
                                    </span>
                                </td>
                                <td>{last_run_time}</td>
                                <td>{duration}</td>
                                <td>{job['schedule']}</td>
                                <td>{history_bars}</td>
                            </tr>
        """

    html += """
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <script>
            // Auto-refresh page every 5 minutes
            setTimeout(() => window.location.reload(), 300000);
            
            // Add click handlers for mobile devices
            document.querySelectorAll('.history-bar').forEach(bar => {
                bar.addEventListener('click', function(e) {
                    // Show tooltip on mobile devices
                    if (window.innerWidth <= 768) {
                        alert(this.getAttribute('data-tooltip'));
                    }
                });
            });
        </script>
    </body>
    </html>
    """
    return html

def main():
    args = getResolvedOptions(sys.argv, ['JOB_NAME'])
    sc = SparkContext()
    glueContext = GlueContext(sc)
    job = Job(glueContext)
    job.init(args['JOB_NAME'], args)
    
    try:
        glue_client = boto3.client('glue')
        s3_client = boto3.client('s3')
        
        print("Fetching Glue jobs information...")
        
        # Get all Glue jobs
        jobs = glue_client.get_jobs()['Jobs']
        job_details = []
        
        for job in jobs:
            job_name = job['Name']
            print(f"Processing job: {job_name}")
            
            schedule = get_trigger_schedule(glue_client, job_name)
            last_run = get_job_last_run(glue_client, job_name)
            history = get_job_history(glue_client, job_name)
            
            job_info = {
                'job_name': job_name,
                'schedule': schedule,
                'last_execution': last_run,
                'history': history
            }
            job_details.append(job_info)
        
        print("Generating HTML report...")
        html_content = generate_html_report(job_details)
        
        # Save to S3
        bucket_name = 'YOUR_BUCKET_NAME'  # Replace with your bucket name
        print(f"Uploading report to S3 bucket: {bucket_name}")
        
        s3_client.put_object(
            Bucket=bucket_name,
            Key='index.html',
            Body=html_content,
            ContentType='text/html',
            CacheControl='no-cache'
        )
            
        print("Dashboard generated and uploaded successfully!")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise e
    
    job.commit()

if __name__ == '__main__':
    main()
