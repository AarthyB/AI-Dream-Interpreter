import os
import csv
import time
from datetime import datetime

def log_performance(endpoint: str, duration: float, user_input: str, status: str = "success"):
    os.makedirs("logs", exist_ok=True)
    with open("logs/performance_log.csv", "a", newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            datetime.now().isoformat(),
            endpoint,
            f"{duration:.2f}",
            user_input[:100],
            status
        ])
