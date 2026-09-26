import os
import base64

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise RuntimeError("OPENAI_API_KEY is not set in .env")

client = OpenAI(api_key=api_key)


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


image_path = input("Enter frame image path: ").strip()

if not os.path.exists(image_path):
    raise FileNotFoundError(f"Image not found: {image_path}")

print("\nAnalyzing frame...")

base64_image = encode_image(image_path)

response = client.responses.create(
    model="gpt-4.1-mini",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": (
                        "Describe only the key visual information in this frame "
                        "in 1-2 short sentences. Mention whether it is animated "
                        "or live-action and the main visible subject."
                    ),
                },
                {
                    "type": "input_image",
                    "image_url": f"data:image/jpeg;base64,{base64_image}",
                },
            ],
        }
    ],
)

print("\nVISUAL CONTEXT:")
print(response.output_text)