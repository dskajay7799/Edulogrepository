import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

users = []

@app.route("/signup", methods=["POST"])
def signup():
    users.append(request.json)
    return jsonify({"status": "success"})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    for user in users:
        if user["email"] == data["email"] and user["phone"] == data["phone"]:
            return jsonify({"success": True, "user": user})
    return jsonify({"success": False})

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("video")
    if file:
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(save_path)
        return "ok"
    return "error", 400

@app.route("/videos", methods=["GET"])
def list_videos():
    files = os.listdir(app.config["UPLOAD_FOLDER"])
    return jsonify([
        {"name": f, "url": f"http://127.0.0.1:5000/uploads/{f}"}
        for f in files
    ])

@app.route("/uploads/<filename>")
def serve_video(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
