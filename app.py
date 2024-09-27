from flask import Flask, render_template, request, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv('API_KEY')

def get_weather(city):
    base_url = 'https://api.weatherapi.com/v1/current.json'  # Corrected API endpoint
    params = {
        'key': API_KEY,
        'q': city
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()
        weather = {
            'city': data['location']['name'],
            'temperature': data['current']['temp_c'],
            'description': data['current']['condition']['text'],
            'humidity': data['current']['humidity'],
            'pressure': data['current']['pressure_mb']
        }
        return weather
    except requests.exceptions.HTTPError as http_err:
        return {'error': f"HTTP error occurred: {http_err}"}
    except requests.exceptions.ConnectionError as conn_err:
        return {'error': f"Connection error: {conn_err}"}
    except requests.exceptions.Timeout as timeout_err:
        return {'error': f"Timeout error: {timeout_err}"}
    except requests.exceptions.RequestException as req_err:
        return {'error': f"An error occurred: {req_err}"}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['POST'])  # Fixed this line
def weather():
    city = request.form['city']
    weather_data = get_weather(city)
    return jsonify(weather_data)

if __name__ == '__main__':
    app.run(debug=True)
