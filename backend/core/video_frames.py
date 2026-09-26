import os
import cv2


def extract_video_frames(
    video_path: str,
    interval_seconds: int = 5,
    output_dir: str = None,
) -> list:
    """
    Extract one video frame every `interval_seconds`.

    Returns a list of dictionaries containing:
    - timestamp
    - frame_path
    """

    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    if output_dir is None:
        output_dir = os.path.join(
            os.path.dirname(video_path),
            "visual_frames"
        )

    os.makedirs(output_dir, exist_ok=True)

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise RuntimeError(f"Could not open video: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)

    if fps <= 0:
        cap.release()
        raise RuntimeError("Could not determine video FPS.")

    duration = frame_count / fps

    frames = []

    current_time = 0.0
    frame_index = 0

    while current_time <= duration:
        cap.set(
            cv2.CAP_PROP_POS_MSEC,
            current_time * 1000
        )

        success, frame = cap.read()

        if not success:
            break

        filename = f"frame_{frame_index:05d}.jpg"
        frame_path = os.path.join(
            output_dir,
            filename
        )

        cv2.imwrite(frame_path, frame)

        frames.append(
            {
                "timestamp": round(current_time, 2),
                "frame_path": frame_path,
            }
        )

        frame_index += 1
        current_time += interval_seconds

    cap.release()

    print(
        f"Extracted {len(frames)} visual frames "
        f"from {duration:.2f}s video."
    )

    return frames