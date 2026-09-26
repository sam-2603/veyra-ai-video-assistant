import os
import cv2
import mediapipe as mp
import subprocess
import librosa
import numpy as np
import tempfile
import webrtcvad
import json
import hashlib


MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "face_landmarker.task"
)


def _get_cache_path(video_path: str) -> str:
    """
    Create a content-based cache path for the video.
    """

    hasher = hashlib.md5()

    with open(video_path, "rb") as file:

        while True:

            data = file.read(1024 * 1024)

            if not data:
                break

            hasher.update(data)

    video_hash = hasher.hexdigest()[:12]

    cache_dir = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "cache"
    )

    os.makedirs(cache_dir, exist_ok=True)

    return os.path.join(
        cache_dir,
        f"sync_analysis_{video_hash}.json"
    )


def analyze_mouth_movement(
    video_path: str,
    sample_fps: int = 1
) -> list:
    """
    Detect face landmarks and measure mouth movement over time.
    """

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise RuntimeError("Could not open video file.")

    original_fps = cap.get(cv2.CAP_PROP_FPS)

    if not original_fps or original_fps <= 0:
        original_fps = 30

    frame_interval = max(
        1,
        int(original_fps / sample_fps)
    )

    base_options = mp.tasks.BaseOptions(
        model_asset_path=MODEL_PATH
    )

    options = mp.tasks.vision.FaceLandmarkerOptions(
        base_options=base_options,
        running_mode=mp.tasks.vision.RunningMode.VIDEO,
        num_faces=1,
        min_face_detection_confidence=0.5,
        min_face_presence_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    results = []
    frame_number = 0
    previous_mouth_activity = None

    with mp.tasks.vision.FaceLandmarker.create_from_options(
        options
    ) as landmarker:

        while True:

            success, frame = cap.read()

            if not success:
                break

            if frame_number % frame_interval != 0:
                frame_number += 1
                continue

            timestamp = frame_number / original_fps

            rgb_frame = cv2.cvtColor(
                frame,
                cv2.COLOR_BGR2RGB
            )

            mp_image = mp.Image(
                image_format=mp.ImageFormat.SRGB,
                data=rgb_frame
            )

            detection = landmarker.detect_for_video(
                mp_image,
                int(timestamp * 1000)
            )

            mouth_activity = 0.0

            if detection.face_landmarks:

                landmarks = detection.face_landmarks[0]

                upper_lip = landmarks[13]
                lower_lip = landmarks[14]
                left_mouth = landmarks[61]
                right_mouth = landmarks[291]

                mouth_height = abs(
                    lower_lip.y - upper_lip.y
                )

                mouth_width = abs(
                    right_mouth.x - left_mouth.x
                )

                if mouth_width > 0:

                    mouth_activity = (
                        mouth_height / mouth_width
                    )

            if previous_mouth_activity is None:

                movement = 0.0

            else:

                movement = abs(
                    mouth_activity
                    - previous_mouth_activity
                )

            previous_mouth_activity = mouth_activity

            results.append(
                {
                    "time": round(timestamp, 3),
                    "mouth_activity": round(
                        movement,
                        4
                    ),
                }
            )

            frame_number += 1

    cap.release()

    return results


def analyze_audio_activity(
    video_path: str,
    sample_fps: int =1
):
    """
    Detect speech activity using WebRTC VAD.
    """

    temp_wav = tempfile.NamedTemporaryFile(
        suffix=".wav",
        delete=False
    ).name

    try:

        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                video_path,
                "-vn",
                "-ac",
                "1",
                "-ar",
                "16000",
                "-sample_fmt",
                "s16",
                temp_wav
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True
        )

        audio, sr = librosa.load(
            temp_wav,
            sr=16000,
            mono=True
        )

        vad = webrtcvad.Vad(2)

        frame_duration_ms = 30

        frame_length = int(
            sr * frame_duration_ms / 1000
        )

        results = []

        for start in range(
            0,
            len(audio) - frame_length,
            frame_length
        ):

            frame = audio[
                start:start + frame_length
            ]

            pcm = (
                frame * 32767
            ).astype(
                np.int16
            ).tobytes()

            is_speech = vad.is_speech(
                pcm,
                sr
            )

            timestamp = start / sr

            results.append(
                {
                    "time": timestamp,
                    "activity": (
                        1.0
                        if is_speech
                        else 0.0
                    )
                }
            )

        return results

    finally:

        if os.path.exists(temp_wav):
            os.remove(temp_wav)


def compare_audio_and_mouth(
    audio_data: list,
    mouth_data: list
) -> dict:
    """
    Compare audio activity and mouth movement.
    """

    mouth_by_time = {
        round(item["time"], 1):
        item["mouth_activity"]
        for item in mouth_data
    }

    audio_values = []
    mouth_values = []

    for item in audio_data:

        timestamp = round(
            item["time"],
            1
        )

        if timestamp in mouth_by_time:

            audio_values.append(
                item["activity"]
            )

            mouth_values.append(
                mouth_by_time[timestamp]
            )

    if len(audio_values) < 2:
        raise RuntimeError(
            "Not enough matching audio/video samples."
        )

    audio_array = np.array(
        audio_values
    )

    mouth_array = np.array(
        mouth_values
    )

    correlation = float(
        np.corrcoef(
            audio_array,
            mouth_array
        )[0, 1]
    )

    return {
        "correlation": round(
            correlation,
            4
        ),
        "matched_samples": len(
            audio_values
        ),
    }


def estimate_sync_offset(
    audio_data: list,   
    mouth_data: list,
    max_offset: float = 2.0
) -> dict:
    """
    Estimate the time offset between audio activity
    and mouth movement.
    """

    mouth_by_time = {
        round(item["time"], 1):
        item["mouth_activity"]
        for item in mouth_data
    }

    audio_by_time = {
        round(item["time"], 1):
        item["activity"]
        for item in audio_data
    }

    common_times = sorted(
        set(audio_by_time)
        & set(mouth_by_time)
    )

    if len(common_times) < 10:
        raise RuntimeError(
            "Not enough matching samples."
        )

    audio = np.array(
        [
            audio_by_time[t]
            for t in common_times
        ]
    )

    mouth = np.array(
        [
            mouth_by_time[t]
            for t in common_times
        ]
    )

    sample_interval = 0.1

    max_shift = int(
        max_offset / sample_interval
    )

    best_correlation = -1
    best_shift = 0

    for shift in range(
        -max_shift,
        max_shift + 1
    ):

        if shift > 0:

            a = audio[shift:]
            m = mouth[:-shift]

        elif shift < 0:

            a = audio[:shift]
            m = mouth[-shift:]

        else:

            a = audio
            m = mouth

        if len(a) < 10:
            continue

        correlation = np.corrcoef(
            a,
            m
        )[0, 1]

        if (
            not np.isnan(correlation)
            and correlation > best_correlation
        ):

            best_correlation = correlation
            best_shift = shift

    offset = (
        best_shift
        * sample_interval
    )

    return {
        "estimated_offset_seconds": round(
            offset,
            2
        ),
        "correlation": round(
            float(best_correlation),
            4
        ),
    }


def analyze_video_sync(
    video_path: str
) -> dict:
    """
    Run the complete sync analysis with caching.
    """

    cache_path = _get_cache_path(
        video_path
    )

    if os.path.exists(cache_path):

        try:

            with open(
                cache_path,
                "r",
                encoding="utf-8"
            ) as file:

                cached_data = json.load(file)

            if cached_data:

                print(
                    "Using cached sync analysis."
                )

                return cached_data

        except (
            json.JSONDecodeError,
            TypeError
        ):

            print(
                "Sync cache is invalid. "
                "Running sync analysis again."
            )

    print(
        "Running audio/video synchronization analysis..."
    )

    mouth_data = analyze_mouth_movement(
        video_path
    )

    audio_data = analyze_audio_activity(
        video_path
    )

    sync_result = estimate_sync_offset(
        audio_data,
        mouth_data
    )

    with open(
        cache_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            sync_result,
            file,
            indent=2
        )

    print(
        f"Sync analysis cached at: {cache_path}"
    )

    return sync_result