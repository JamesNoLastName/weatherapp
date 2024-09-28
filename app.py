from flask import Flask, render_template, request, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv('API_KEY')

def get_weather(city):
    base_url = 'https://api.weatherapi.com/v1/current.json'
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
    except requests.exceptions.HTTPError:
        return {'error': "Unable to fetch weather data. Please check the city name."}
    except requests.exceptions.ConnectionError:
        return {'error': "Connection error. Please check your internet connection."}
    except requests.exceptions.Timeout:
        return {'error': "Request timed out. Please try again."}
    except requests.exceptions.RequestException:
        return {'error': "An unexpected error occurred. Please try again later."}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['POST'])
def weather():
    city = request.form['city']
    weather_data = get_weather(city)
    return jsonify(weather_data)

if __name__ == '__main__':
    app.run(debug=True)
