import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database connection details from environment variables
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "1433")  # Default to 1433 if not set
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_DATABASE = os.getenv("DB_DATABASE")

# Create a dictionary for the database config
db_config = {
    "dev": {
        "driver": "mysql",
        "host": DB_HOST,
        "user": DB_USERNAME,
        "password": DB_PASSWORD,
        "database": DB_DATABASE,
        "port": int(DB_PORT),
    }
}

# Write the dictionary to a JSON file
output_file = "database.json"
with open(output_file, "w") as json_file:
    json.dump(db_config, json_file, indent=4)

print(f"✅ Generated {output_file} successfully.")
