import sqlite3
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import string
from datetime import datetime
import re

app = Flask(__name__)
CORS(app)

class EloyNominator:
    def __init__(self):
        self.url = "https://www.eloyawards.com/nominate-2025/"
        self.session = requests.Session()
        self.init_db()
    
    def init_db(self):
        conn = sqlite3.connect('nominations.db')
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS submissions
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      nominator_first TEXT, nominator_last TEXT,
                      nominator_phone TEXT, nominator_email TEXT,
                      category TEXT, nominee_first TEXT, nominee_last TEXT,
                      nominee_instagram TEXT, nominee_linkedin TEXT,
                      reason TEXT, nominee_email TEXT, nominee_phone TEXT,
                      nominee_website TEXT, token TEXT, timestamp TEXT)''')
        conn.commit()
        conn.close()
    
    def get_form_data(self):
        try:
            response = self.session.get(self.url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            token_input = soup.find('input', {'name': 'wpforms[id]'})
            form_id = token_input['value'] if token_input else '4045'
            
            token_time_match = re.search(r'data-token-time="(\d+)"', response.text)
            token_time = token_time_match.group(1) if token_time_match else str(int(datetime.now().timestamp()))
            
            token_match = re.search(r'data-token="([^"]+)"', response.text)
            token = token_match.group(1) if token_match else self.generate_token()
            
            categories = []
            select_options = soup.find('select', {'id': 'wpforms-4045-field_12'})
            if select_options:
                for option in select_options.find_all('option'):
                    categories.append(option.get('value', option.text.strip()))
            
            return {
                'form_id': form_id,
                'token': token,
                'token_time': token_time,
                'categories': categories
            }
        except Exception as e:
            return None
    
    def generate_token(self):
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=32))
    
    def submit_nomination(self, data):
        form_data = self.get_form_data()
        if not form_data:
            return False, "Failed to get form data"
        
        payload = {
            'wpforms[fields][1][first]': data['nominator_first'],
            'wpforms[fields][1][last]': data['nominator_last'],
            'wpforms[fields][2]': data['nominator_phone'],
            'wpforms[fields][7]': data['nominator_email'],
            'wpforms[fields][12]': data['category'],
            'wpforms[fields][4][first]': data['nominee_first'],
            'wpforms[fields][4][last]': data['nominee_last'],
            'wpforms[fields][11]': data['nominee_instagram'],
            'wpforms[fields][16]': data['nominee_linkedin'],
            'wpforms[fields][8]': data['reason'],
            'wpforms[fields][17]': data['nominee_email'],
            'wpforms[fields][18]': data['nominee_phone'],
            'wpforms[fields][19]': data['nominee_website'],
            'wpforms[fields][15][]': 'YES',
            'wpforms[id]': form_data['form_id'],
            'page_title': 'Nominate 2025',
            'page_url': self.url,
            'url_referer': '',
            'page_id': '4042',
            'wpforms[post_id]': '4042',
            'wpforms[submit]': 'wpforms-submit'
        }
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': self.url
        }
        
        try:
            response = self.session.post(self.url, data=payload, headers=headers)
            self.save_submission(data, form_data['token'])
            return True, "Nomination submitted successfully"
        except Exception as e:
            return False, f"Submission failed: {str(e)}"
    
    def save_submission(self, data, token):
        conn = sqlite3.connect('nominations.db')
        c = conn.cursor()
        c.execute('''INSERT INTO submissions 
                     (nominator_first, nominator_last, nominator_phone, nominator_email,
                      category, nominee_first, nominee_last, nominee_instagram, 
                      nominee_linkedin, reason, nominee_email, nominee_phone,
                      nominee_website, token, timestamp)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (data['nominator_first'], data['nominator_last'], data['nominator_phone'],
                   data['nominator_email'], data['category'], data['nominee_first'],
                   data['nominee_last'], data['nominee_instagram'], data['nominee_linkedin'],
                   data['reason'], data['nominee_email'], data['nominee_phone'],
                   data['nominee_website'], token, datetime.now().isoformat()))
        conn.commit()
        conn.close()
    
    def get_submissions(self):
        conn = sqlite3.connect('nominations.db')
        c = conn.cursor()
        c.execute('SELECT * FROM submissions ORDER BY timestamp DESC')
        submissions = c.fetchall()
        conn.close()
        return submissions

nominator = EloyNominator()

@app.route('/api/categories', methods=['GET'])
def get_categories():
    form_data = nominator.get_form_data()
    return jsonify({'categories': form_data['categories'] if form_data else []})

@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.json
    success, message = nominator.submit_nomination(data)
    return jsonify({'success': success, 'message': message})

@app.route('/api/submissions', methods=['GET'])
def submissions():
    submissions = nominator.get_submissions()
    return jsonify({'submissions': submissions})

if __name__ == '__main__':
    app.run(debug=True, port=5000)