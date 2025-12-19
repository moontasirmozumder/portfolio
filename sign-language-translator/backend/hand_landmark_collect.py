import cv2
import mediapipe as mp

# MediaPipe modules
mp_face = mp.solutions.face_detection
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils

# Initialize detectors
face_detection = mp_face.FaceDetection(model_selection=0, min_detection_confidence=0.5)
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Open Camera
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Convert BGR to RGB
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # -------- FACE DETECTION --------
    face_results = face_detection.process(rgb)
    if face_results.detections:
        for detection in face_results.detections:
            mp_draw.draw_detection(frame, detection)

    # -------- POSE DETECTION --------
    pose_results = pose.process(rgb)
    if pose_results.pose_landmarks:
        mp_draw.draw_landmarks(
            frame,
            pose_results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS
        )

    # -------- HAND DETECTION --------
    hand_results = hands.process(rgb)
    if hand_results.multi_hand_landmarks:
        for hand_landmarks in hand_results.multi_hand_landmarks:
            mp_draw.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS
            )

    # Display
    cv2.imshow("Face | Pose | Hand Detection", frame)

    # Press Q to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release
cap.release()
cv2.destroyAllWindows()
