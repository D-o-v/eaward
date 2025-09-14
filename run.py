#!/usr/bin/env python3
import subprocess
import sys
import os
import time

def run_backend():
    """Start Flask backend"""
    print("Starting Flask backend...")
    return subprocess.Popen([sys.executable, "app.py"], cwd=os.getcwd())

def run_frontend():
    """Start React frontend"""
    print("Starting React frontend...")
    return subprocess.Popen(["npm", "start"], cwd=os.getcwd())

def main():
    try:
        # Start backend
        backend_process = run_backend()
        time.sleep(3)  # Give backend time to start
        
        # Start frontend
        frontend_process = run_frontend()
        
        print("\n" + "="*50)
        print("ELOY Awards Nominator is running!")
        print("Backend: http://localhost:5000")
        print("Frontend: http://localhost:3000")
        print("Press Ctrl+C to stop both servers")
        print("="*50 + "\n")
        
        # Wait for processes
        backend_process.wait()
        frontend_process.wait()
        
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        backend_process.terminate()
        frontend_process.terminate()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()