from core.video_sync import (
    analyze_mouth_movement,
    analyze_audio_activity,
    estimate_sync_offset,
)

video_path = input("Enter video path: ").strip()

print("\nAnalyzing mouth movement...")
mouth_data = analyze_mouth_movement(video_path)

print("Analyzing audio activity...")
audio_data = analyze_audio_activity(video_path)

print("Estimating sync offset...")
result = estimate_sync_offset(audio_data, mouth_data)

print("\nSync offset:")
print(result)