import os
import base64
import json
import hashlib

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()


api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise RuntimeError(
        "OPENAI_API_KEY is not set in .env"
    )


client = OpenAI(api_key=api_key)


def encode_image(image_path: str) -> str:

    with open(
        image_path,
        "rb"
    ) as image_file:

        return base64.b64encode(
            image_file.read()
        ).decode("utf-8")


def analyze_frame(frame_path: str) -> str:
    """
    Analyze one representative video frame
    and return short visual context.
    """

    if not os.path.exists(frame_path):

        raise FileNotFoundError(
            f"Frame not found: {frame_path}"
        )

    base64_image = encode_image(
        frame_path
    )

    response = client.responses.create(
        model="gpt-4.1-nano",
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": (
                            "Describe only the key visual "
                            "information in this frame in "
                            "1-2 short sentences. "
                            "Mention whether it is animated "
                            "or live-action and the main "
                            "visible subjects or action."
                        ),
                    },
                    {
                        "type": "input_image",
                        "image_url": (
                            "data:image/jpeg;base64,"
                            f"{base64_image}"
                        ),
                        "detail": "low",
                    },
                ],
            }
        ],
    )

    return response.output_text.strip()


def _get_cache_path(frames: list) -> str:
    """
    Create a content-based cache path for the
    visual analysis.

    The cache is stored in backend/cache so it
    survives temporary upload-file cleanup.
    """

    hasher = hashlib.md5()

    for frame in frames:

        frame_path = frame["frame_path"]

        with open(
            frame_path,
            "rb"
        ) as file:

            while True:

                data = file.read(
                    1024 * 1024
                )

                if not data:
                    break

                hasher.update(data)

    cache_hash = hasher.hexdigest()[:12]

    cache_dir = os.path.join(
        os.path.dirname(
            os.path.dirname(__file__)
        ),
        "cache"
    )

    os.makedirs(
        cache_dir,
        exist_ok=True
    )

    return os.path.join(
        cache_dir,
        f"visual_{cache_hash}.json"
    )


def analyze_video_frames(frames: list) -> list:
    """
    Analyze extracted video frames.

    Results are cached locally so the same frames
    are not sent to the vision model repeatedly.
    """

    if not frames:
        return []

    cache_path = _get_cache_path(
        frames
    )

    # ---------------------------------------------------------
    # Check existing cache
    # ---------------------------------------------------------

    if os.path.exists(cache_path):

        try:

            with open(
                cache_path,
                "r",
                encoding="utf-8"
            ) as file:

                cached_data = json.load(
                    file
                )

            cached_frames = cached_data.get(
                "frames",
                []
            )

            if len(cached_frames) == len(frames):

                timestamps_match = all(
                    float(
                        cached_frames[i]["timestamp"]
                    )
                    == float(
                        frames[i]["timestamp"]
                    )
                    for i in range(
                        len(frames)
                    )
                )

                if timestamps_match:

                    print(
                        "Using cached visual analysis "
                        f"({len(cached_frames)} frames)."
                    )

                    return cached_frames

        except (
            json.JSONDecodeError,
            KeyError,
            TypeError
        ):

            print(
                "Visual cache is invalid. "
                "Running visual analysis again."
            )

    # ---------------------------------------------------------
    # Analyze frames
    # ---------------------------------------------------------

    visual_context = []

    for i, frame in enumerate(frames):

        timestamp = frame["timestamp"]
        frame_path = frame["frame_path"]

        print(
            "Analyzing visual frame "
            f"{i + 1}/{len(frames)} "
            f"at {timestamp}s..."
        )

        description = analyze_frame(
            frame_path
        )

        visual_context.append(
            {
                "timestamp": timestamp,
                "description": description,
            }
        )

    # ---------------------------------------------------------
    # Save cache
    # ---------------------------------------------------------

    with open(
        cache_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            {
                "frames": visual_context
            },
            file,
            indent=2,
            ensure_ascii=False
        )

    print(
        "Visual analysis complete: "
        f"{len(visual_context)} frames analyzed."
    )

    print(
        "Visual context cached at: "
        f"{cache_path}"
    )

    return visual_context