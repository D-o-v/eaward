#!/usr/bin/env python3
import requests
import json

def test_submission():
    """Test the nomination submission"""
    
    # Test data
    test_data = {
        "nominator_first": "John",
        "nominator_last": "Doe",
        "nominator_phone": "+1234567890",
        "nominator_email": "john.doe@example.com",
        "category": "ELOY Award for Entrepreneur",
        "nominee_first": "Jane",
        "nominee_last": "Smith",
        "nominee_instagram": "@janesmith",
        "nominee_linkedin": "https://linkedin.com/in/janesmith",
        "reason": "Outstanding leadership and innovation in business",
        "nominee_email": "jane.smith@example.com",
        "nominee_phone": "+0987654321",
        "nominee_website": "https://janesmith.com"
    }
    
    try:
        # Test categories endpoint
        print("Testing categories endpoint...")
        response = requests.get('http://localhost:5000/api/categories')
        if response.status_code == 200:
            categories = response.json()['categories']
            print(f"✓ Categories loaded: {len(categories)} categories")
        else:
            print(f"✗ Categories failed: {response.status_code}")
            return
        
        # Test submission
        print("\nTesting submission...")
        response = requests.post('http://localhost:5000/api/submit', json=test_data)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"✓ Submission successful: {result['message']}")
            else:
                print(f"✗ Submission failed: {result['message']}")
        else:
            print(f"✗ Request failed: {response.status_code}")
        
        # Test submissions list
        print("\nTesting submissions list...")
        response = requests.get('http://localhost:5000/api/submissions')
        if response.status_code == 200:
            submissions = response.json()['submissions']
            print(f"✓ Submissions retrieved: {len(submissions)} total")
        else:
            print(f"✗ Submissions list failed: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("✗ Connection failed. Make sure the Flask server is running on port 5000")
    except Exception as e:
        print(f"✗ Test failed: {e}")

if __name__ == "__main__":
    test_submission()