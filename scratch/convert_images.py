import os
import glob
from PIL import Image # pyrefly: ignore [missing-import]

brain_dir = r"C:\Users\hp\.gemini\antigravity-ide\brain\3a1bdd74-6523-43cf-ae5f-39cb8b2a1fc4"
dest_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "images", "sweets"))

os.makedirs(dest_dir, exist_ok=True)

sweets = {
    "motichoor_ladoo": "motichoor_ladoo",
    "kaju_katli": "kaju_katli",
    "gulab_jamun": "gulab_jamun",
    "rasgulla": "rasgulla",
    "peda": "peda",
    "milk_cake": "milk_cake",
    "barfi": "barfi",
    "jalebi": "jalebi"
}

print("Starting conversion...")
for sweet_key, dest_name in sweets.items():
    # Find files starting with sweet_key and ending with .png in the brain directory
    search_path = os.path.join(brain_dir, f"{sweet_key}_*.png")
    matches = glob.glob(search_path)
    if not matches:
        print(f"No match found for key: {sweet_key}")
        continue
    
    # Get the latest generated image matching this key
    matches.sort(key=os.path.getmtime)
    source_png = matches[-1]
    
    dest_webp = os.path.join(dest_dir, f"{dest_name}.webp")
    print(f"Converting {os.path.basename(source_png)} -> {dest_name}.webp")
    
    try:
        with Image.open(source_png) as img:
            img.save(dest_webp, "WEBP", quality=85)
        print("Success!")
    except Exception as e:
        print(f"Failed to convert: {e}")

print("Image conversion complete.")
