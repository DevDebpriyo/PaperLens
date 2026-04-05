import subprocess
import ujson as json

bot_files = ["backend/host.py","backend/mongodb.py","backend/postgres.py"]

processes = []

try:
    for bot_file in bot_files:
        print(f"Starting {bot_file}...")
        process = subprocess.Popen(["python", bot_file])
        processes.append(process)
    
    for process in processes:
        process.wait()

except KeyboardInterrupt:
    print("\nShutting down bots...")
    for process in processes:
        process.terminate()
