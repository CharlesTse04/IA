from ultralytics import YOLO
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # 這將允許所有來源的請求

# 1. 加載訓練好的模型
model = YOLO('run/train4_backup/weights/best.pt')  # 替換為你的模型路徑

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/add', methods=['POST'])
def add():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        os.makedirs('uploads', exist_ok=True)

        image_path = os.path.join('uploads', file.filename)
        file.save(image_path)

        results = model.predict(image_path, imgsz=128)

        predicted_class_idx = results[0].probs.top1
        predicted_name = model.names[int(predicted_class_idx)]

        print(f"Predicted class: {predicted_name}")

        os.remove(image_path)

        return jsonify({"predicted_class": predicted_name})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    
    app.run(host='0.0.0.0', port=5001, debug=True)