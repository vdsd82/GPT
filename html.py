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
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AWS Glue Jobs Dashboard</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            :root {{
                --primary-color: #0ea5e9;
                --success-color: #22c55e;
                --danger-color: #ef4444;
                --warning-color: #f59e0b;
                --background-color: #f8fafc;
                --card-background: #ffffff;
                --text-primary: #0f172a;
                --text-secondary: #64748b;
                --border-color: #e2e8f0;
            }}

            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}

            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                background-color: var(--background-color);
                color: var(--text-primary);
                line-height: 1.6;
                min-height: 100vh;
            }}

            .dashboard {{
                max-width: 1400px;
                margin: 0 auto;
                padding: 2rem;
            }}

            .header {{
                background: linear-gradient(135deg, var(--primary-color), #3b82f6);
                color: white;
                padding: 2rem;
                border-radius: 1rem;
                margin-bottom: 2rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }}

            .title {{
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }}

            .subtitle {{
                color: rgba(255, 255, 255, 0.9);
                font-size: 1rem;
            }}

            .stats-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }}

            .stat-card {{
                background: var(--card-background);
                padding: 1.5rem;
                border-radius: 1rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                transition: transform 0.2s, box-shadow 0.2s;
                border: 1px solid var(--border-color);
            }}

            .stat-card:hover {{
                transform: translateY(-2px);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }}

            .stat-header {{
                display: flex;
                align-items: center;
                margin-bottom: 1rem;
            }}

            .stat-icon {{
                width: 3rem;
                height: 3rem;
                border-radius: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 1rem;
            }}

            .stat-value {{
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: var(--text-primary);
            }}

            .stat-label {{
                color: var(--text-secondary);
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }}

            .jobs-container {{
                background: var(--card-background);
                border-radius: 1rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                border: 1px solid var(--border-color);
                overflow: hidden;
            }}

            .container-header {{
                padding: 1.5rem;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }}

            .container-title {{
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--text-primary);
            }}

            .table-container {{
                overflow-x: auto;
            }}

            table {{
                width: 100%;
                border-collapse: collapse;
            }}

            th {{
                background: var(--background-color);
                padding: 1rem;
                text-align: left;
                font-weight: 500;
                color: var(--text-secondary);
                border-bottom: 2px solid var(--border-color);
            }}

            td {{
                padding: 1rem;
                border-bottom: 1px solid var(--border-color);
                color: var(--text-primary);
            }}

            tr:hover {{
                background-color: #f8fafc;
            }}

            .status-badge {{
                padding: 0.375rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.875rem;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
                gap: 0.375rem;
            }}

            .status-succeeded {{
                background-color: #dcfce7;
                color: var(--success-color);
            }}

            .status-failed {{
                background-color: #fee2e2;
                color: var(--danger-color);
            }}

            .status-running {{
                background-color: #e0f2fe;
                color: var(--primary-color);
            }}

            .status-unknown {{
                background-color: #f3f4f6;
                color: var(--text-secondary);
            }}

            .history-bars {{
                display: flex;
                align-items: center;
                gap: 0.25rem;
                padding: 0.5rem 0;
            }}

            .history-bar {{
                width: 8px;
                height: 24px;
                border-radius: 2px;
                position: relative;
                cursor: pointer;
                transition: transform 0.2s;
            }}

            .history-bar:hover {{
                transform: scaleY(1.2);
            }}

            .history-bar:hover::before {{
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                padding: 0.75rem;
                background: var(--text-primary);
                color: white;
                border-radius: 0.375rem;
                font-size: 0.75rem;
                white-space: pre-line;
                z-index: 1000;
                min-width: 200px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                margin-bottom: 0.5rem;
            }}

            .bar-succeeded {{ background-color: var(--success-color); }}
            .bar-failed {{ background-color: var(--danger-color); }}
            .bar-running {{ background-color: var(--primary-color); }}
            .bar-unknown {{ background-color: var(--text-secondary); }}

            .search-box {{
                padding: 0.5rem 1rem;
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                font-size: 0.875rem;
                width: 300px;
                transition: all 0.2s;
            }}

            .search-box:focus {{
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
            }}

            @media (max-width: 768px) {{
                .dashboard {{
                    padding: 1rem;
                }}
                
                .stats-grid {{
                    grid-template-columns: 1fr;
                }}

                .search-box {{
                    width: 100%;
                    margin-bottom: 1rem;
                }}

                .history-bar:hover::before {{
                    min-width: 160px;
                    font-size: 0.7rem;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="dashboard">
            <div class="header">
                <h1 class="title">AWS Glue Jobs Dashboard</h1>
                <div class="subtitle">
                    Last updated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')} UTC
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="background-color: #e0f2fe;">
                            <i class="fas fa-layer-group fa-lg" style="color: var(--primary-color);"></i>
                        </div>
                    </div>
                    <div class="stat-value">{total_jobs}</div>
                    <div class="stat-label">Total Jobs</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="background-color: #dcfce7;">
                            <i class="fas fa-check-circle fa-lg" style="color: var(--success-color);"></i>
                        </div>
                    </div>
                    <div class="stat-value">{succeeded_jobs}</div>
                    <div class="stat-label">Succeeded</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="background-color: #fee2e2;">
                            <i class="fas fa-times-circle fa-lg" style="color: var(--danger-color);"></i>
                        </div>
                    </div>
                    <div class="stat-value">{failed_jobs}</div>
                    <div class="stat-label">Failed</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="background-color: #e0f2fe;">
                            <i class="fas fa-sync fa-lg" style="color: var(--primary-color);"></i>
                        </div>
                    </div>
                    <div class="stat-value">{running_jobs}</div>
                    <div class="stat-label">Running</div>
                </div>
            </div>

            <div class="jobs-container">
                <div class="container-header">
                    <div class="container-title">Job Details</div>
                    <input type="text" class="search-box" placeholder="Search jobs..." id="jobSearch">
                </div>
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
            // Search functionality
            document.getElementById('jobSearch').addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const rows = document.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const jobName = row.querySelector('td:first-child').textContent.toLowerCase();
                    row.style.display = jobName.includes(searchTerm) ? '' : 'none';
                });
            });

            // Auto-refresh every 5 minutes
            setTimeout(() => window.location.reload(), 300000);
            
            // Mobile tooltip handler
            document.querySelectorAll('.history-bar').forEach(bar => {
                bar.addEventListener('click', function(e) {
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
