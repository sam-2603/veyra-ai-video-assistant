from core.video_frames import extract_video_frames
from core.visual_analyzer import analyze_video_frames


video_path = input("Enter video path: ").strip()

frames = extract_video_frames(
    video_path,
    interval_seconds=10
)

visual_context = analyze_video_frames(frames)

print("\n" + "=" * 60)
print("VISUAL CONTEXT")
print("=" * 60)

for item in visual_context:
    print(f"\n[{item['timestamp']}s]")
    print(item["description"])