from core.video_frames import extract_video_frames


video_path = input("Enter video path: ").strip()

frames = extract_video_frames(
    video_path,
    interval_seconds=10
)

print("\nExtracted frames:")

for frame in frames:
    print(
        f"{frame['timestamp']}s -> "
        f"{frame['frame_path']}"
    )