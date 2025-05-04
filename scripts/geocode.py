import json
import time
import requests
from pathlib import Path

# Path to the JSON file
JSON_PATH = Path(__file__).parent.parent / 'public' / 'obscure_cities.json'

def geocode_city(city, country):
    """Geocode a city using Nominatim API."""
    # Construct the query
    query = f"{city}, {country}"
    
    # Make the request
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": query,
        "format": "json",
        "limit": 1
    }
    
    # Add a user agent to comply with Nominatim's usage policy
    headers = {
        "User-Agent": "CityGeocoder/1.0"
    }
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if data:
            return {
                "lat": float(data[0]["lat"]),
                "lon": float(data[0]["lon"])
            }
        return None
    except Exception as e:
        print(f"Error geocoding {query}: {str(e)}")
        return None

def main():
    # Read the existing JSON file
    with open(JSON_PATH, 'r') as f:
        cities = json.load(f)
    
    # Track how many cities we've processed
    processed = 0
    total = len(cities)
    
    # Process each city
    for city_data in cities:
        # Skip if already has coordinates
        if "lat" in city_data and "lon" in city_data:
            continue
            
        # Get coordinates
        coords = geocode_city(city_data["city"], city_data["country"])
        
        if coords:
            city_data.update(coords)
            processed += 1
            print(f"Geocoded {city_data['city']}, {city_data['country']}: {coords}")
        else:
            print(f"Failed to geocode {city_data['city']}, {city_data['country']}")
        
        # Respect Nominatim's usage policy (1 request per second)
        time.sleep(1)
    
    # Write back to the file
    with open(JSON_PATH, 'w') as f:
        json.dump(cities, f, indent=2)
    
    print(f"\nGeocoding complete!")
    print(f"Processed {processed} out of {total} cities")

if __name__ == "__main__":
    main() 