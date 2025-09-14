#!/usr/bin/env python3
"""
Script to inspect what your backend sends to ELOY
"""
import json
from app import EloyNominator

def inspect_payload():
    nominator = EloyNominator()
    
    # Sample data (you can modify this)
    sample_data = {
        'nominator_first': 'John',
        'nominator_last': 'Doe',
        'nominator_phone': '+1234567890',
        'nominator_email': 'john@example.com',
        'category': 'Best Entrepreneur',
        'nominee_first': 'Jane',
        'nominee_last': 'Smith',
        'nominee_instagram': '@janesmith',
        'nominee_linkedin': 'linkedin.com/in/janesmith',
        'reason': 'Outstanding leadership and innovation',
        'nominee_email': 'jane@example.com',
        'nominee_phone': '+0987654321',
        'nominee_website': 'janesmith.com'
    }
    
    print("🔍 INSPECTING ELOY SUBMISSION PAYLOAD")
    print("=" * 50)
    
    # Get form data first
    form_data = nominator.get_form_data()
    if not form_data:
        print("❌ Failed to get form data from ELOY website")
        return
    
    print(f"📋 Form Data Retrieved:")
    print(f"   Form ID: {form_data['form_id']}")
    print(f"   Token: {form_data['token'][:20]}...")
    print(f"   Token Time: {form_data['token_time']}")
    print(f"   Categories: {len(form_data['categories'])} found")
    print()
    
    # Generate the payload that would be sent
    url = nominator.generate_fbclid_url()
    from datetime import datetime
    import random
    
    start_timestamp = int(datetime.now().timestamp())
    end_timestamp = start_timestamp + random.randint(30, 180)
    
    payload = {
        'wpforms[fields][1][first]': sample_data['nominator_first'],
        'wpforms[fields][1][last]': sample_data['nominator_last'],
        'wpforms[fields][2]': sample_data['nominator_phone'],
        'wpforms[fields][7]': sample_data['nominator_email'],
        'wpforms[fields][12]': sample_data['category'],
        'wpforms[fields][4][first]': sample_data['nominee_first'],
        'wpforms[fields][4][last]': sample_data['nominee_last'],
        'wpforms[fields][11]': sample_data['nominee_instagram'],
        'wpforms[fields][16]': sample_data['nominee_linkedin'],
        'wpforms[fields][8]': sample_data['reason'],
        'wpforms[fields][17]': sample_data['nominee_email'],
        'wpforms[fields][18]': sample_data['nominee_phone'],
        'wpforms[fields][19]': sample_data['nominee_website'],
        'wpforms[fields][15][]': 'YES',
        'wpforms[id]': form_data['form_id'],
        'page_title': 'Nominate 2025',
        'page_url': url,
        'url_referer': '',
        'page_id': '4042',
        'wpforms[post_id]': '4042',
        'wpforms[submit]': 'wpforms-submit',
        'wpforms[token]': form_data['token'],
        'action': 'wpforms_submit',
        'start_timestamp': start_timestamp,
        'end_timestamp': end_timestamp
    }
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': url,
        'Origin': 'https://www.eloyawards.com',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'X-Requested-With': 'XMLHttpRequest'
    }
    
    print("🎯 SUBMISSION TARGET:")
    print(f"   URL: https://www.eloyawards.com/wp-admin/admin-ajax.php")
    print(f"   Method: POST")
    print(f"   Referer: {url[:60]}...")
    print()
    
    print("📤 HEADERS BEING SENT:")
    for key, value in headers.items():
        if key == 'User-Agent':
            print(f"   {key}: {value[:50]}...")
        else:
            print(f"   {key}: {value}")
    print()
    
    print("📦 PAYLOAD BEING SENT:")
    for key, value in payload.items():
        if 'token' in key.lower() and len(str(value)) > 20:
            print(f"   {key}: {str(value)[:20]}...")
        else:
            print(f"   {key}: {value}")
    print()
    
    print("🔗 GENERATED FACEBOOK URL:")
    print(f"   {url}")
    print()
    
    print("⏰ TIMESTAMPS:")
    print(f"   Start: {start_timestamp} ({datetime.fromtimestamp(start_timestamp)})")
    print(f"   End: {end_timestamp} ({datetime.fromtimestamp(end_timestamp)})")
    print(f"   Duration: {end_timestamp - start_timestamp} seconds")
    print()
    
    # Show what the actual submission would look like
    print("🚀 WOULD SUBMIT TO ELOY WITH:")
    print(f"   ✓ Valid form token from ELOY website")
    print(f"   ✓ Realistic Facebook click ID")
    print(f"   ✓ Proper WordPress form structure")
    print(f"   ✓ All required fields populated")
    print(f"   ✓ Correct headers and referer")
    print(f"   ✓ Timestamps for form interaction simulation")

if __name__ == "__main__":
    inspect_payload()