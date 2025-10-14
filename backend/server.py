from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Data storage (in production, use a proper database)
DATA_FILE = 'cms_data.json'
MESSAGES_FILE = 'messages.json'

# Initialize data files if they don't exist
def init_data_files():
    if not os.path.exists(DATA_FILE):
        default_data = {
            "services": [
                {
                    "id": 1,
                    "name": "General Medicine",
                    "description": "Comprehensive primary care services for all ages, including diagnosis, treatment, and preventive care.",
                    "keywords": ["general", "medicine", "primary care", "gp", "doctor", "consultation"]
                },
                {
                    "id": 2,
                    "name": "Cardiology",
                    "description": "Expert cardiac care including ECG, stress tests, and heart disease management.",
                    "keywords": ["heart", "cardiology", "cardiac", "ecg", "blood pressure"]
                },
                {
                    "id": 3,
                    "name": "Pediatrics",
                    "description": "Specialized healthcare for infants, children, and adolescents with compassionate care.",
                    "keywords": ["children", "pediatrics", "kids", "baby", "vaccination"]
                },
                {
                    "id": 4,
                    "name": "Laboratory Services",
                    "description": "State-of-the-art diagnostic testing with accurate and timely results.",
                    "keywords": ["lab", "laboratory", "test", "blood test", "diagnosis"]
                },
                {
                    "id": 5,
                    "name": "Pharmacy",
                    "description": "24/7 pharmacy services with a wide range of medications and professional consultation.",
                    "keywords": ["pharmacy", "medicine", "medication", "drugs", "prescription"]
                }
            ],
            "workingHours": {
                "emergency": "24/7 - Open all day, every day",
                "consultation": "Monday to Saturday: 8:00 AM - 6:00 PM",
                "pharmacy": "24/7 - Open all day, every day",
                "laboratory": "Monday to Saturday: 7:00 AM - 7:00 PM"
            },
            "contact": {
                "phone": "+254-XXX-XXX-XXX",
                "email": "info@dohanmedicare.com",
                "emergencyPhone": "+254-XXX-XXX-XXX",
                "location": "Dohani Medicare Hospital"
            }
        }
        with open(DATA_FILE, 'w') as f:
            json.dump(default_data, f, indent=2)
    
    if not os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, 'w') as f:
            json.dump([], f)

init_data_files()

# Helper functions
def load_data():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def load_messages():
    with open(MESSAGES_FILE, 'r') as f:
        return json.load(f)

def save_message(message):
    messages = load_messages()
    message['id'] = len(messages) + 1
    message['timestamp'] = datetime.now().isoformat()
    message['status'] = 'unread'
    messages.append(message)
    with open(MESSAGES_FILE, 'w') as f:
        json.dump(messages, f, indent=2)
    return message

def send_email_notification(to_email, subject, body):
    """
    Send email notification (requires SMTP configuration)
    For production, configure with actual SMTP credentials
    """
    try:
        # Email configuration (use environment variables in production)
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        sender_email = os.getenv('SENDER_EMAIL', 'noreply@dohanmedicare.com')
        sender_password = os.getenv('SENDER_PASSWORD', '')
        
        if not sender_password:
            print("Email notification skipped: No SMTP credentials configured")
            return False
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"Email error: {str(e)}")
        return False

# API Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

# CMS Data Management Routes

@app.route('/api/cms/data', methods=['GET'])
def get_cms_data():
    """Get all CMS data"""
    data = load_data()
    return jsonify(data)

@app.route('/api/cms/services', methods=['GET', 'POST'])
def manage_services():
    """Get all services or add a new service"""
    data = load_data()
    
    if request.method == 'GET':
        return jsonify(data['services'])
    
    elif request.method == 'POST':
        new_service = request.json
        new_service['id'] = max([s['id'] for s in data['services']], default=0) + 1
        data['services'].append(new_service)
        save_data(data)
        return jsonify(new_service), 201

@app.route('/api/cms/services/<int:service_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_service(service_id):
    """Get, update, or delete a specific service"""
    data = load_data()
    service = next((s for s in data['services'] if s['id'] == service_id), None)
    
    if not service:
        return jsonify({"error": "Service not found"}), 404
    
    if request.method == 'GET':
        return jsonify(service)
    
    elif request.method == 'PUT':
        updated_service = request.json
        updated_service['id'] = service_id
        data['services'] = [s if s['id'] != service_id else updated_service for s in data['services']]
        save_data(data)
        return jsonify(updated_service)
    
    elif request.method == 'DELETE':
        data['services'] = [s for s in data['services'] if s['id'] != service_id]
        save_data(data)
        return jsonify({"message": "Service deleted"}), 200

@app.route('/api/cms/working-hours', methods=['GET', 'PUT'])
def manage_working_hours():
    """Get or update working hours"""
    data = load_data()
    
    if request.method == 'GET':
        return jsonify(data['workingHours'])
    
    elif request.method == 'PUT':
        data['workingHours'] = request.json
        save_data(data)
        return jsonify(data['workingHours'])

@app.route('/api/cms/contact', methods=['GET', 'PUT'])
def manage_contact():
    """Get or update contact information"""
    data = load_data()
    
    if request.method == 'GET':
        return jsonify(data['contact'])
    
    elif request.method == 'PUT':
        data['contact'] = request.json
        save_data(data)
        return jsonify(data['contact'])

# Message and Email Notification Routes

@app.route('/api/messages', methods=['GET', 'POST'])
def manage_messages():
    """Get all messages or submit a new message"""
    if request.method == 'GET':
        messages = load_messages()
        return jsonify(messages)
    
    elif request.method == 'POST':
        message_data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        if not all(field in message_data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Save message
        saved_message = save_message(message_data)
        
        # Send email notification to admin
        admin_email = os.getenv('ADMIN_EMAIL', 'info@dohanmedicare.com')
        subject = f"New Message from {message_data['name']}"
        body = f"""
        <html>
        <body>
            <h2>New Message Received</h2>
            <p><strong>From:</strong> {message_data['name']}</p>
            <p><strong>Email:</strong> {message_data['email']}</p>
            <p><strong>Message:</strong></p>
            <p>{message_data['message']}</p>
            <p><strong>Received at:</strong> {saved_message['timestamp']}</p>
        </body>
        </html>
        """
        send_email_notification(admin_email, subject, body)
        
        # Send confirmation email to user
        user_subject = "Thank you for contacting Dohani Medicare"
        user_body = f"""
        <html>
        <body>
            <h2>Thank you for contacting us!</h2>
            <p>Dear {message_data['name']},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your message:</strong></p>
            <p>{message_data['message']}</p>
            <br>
            <p>Best regards,</p>
            <p>Dohani Medicare Team</p>
        </body>
        </html>
        """
        send_email_notification(message_data['email'], user_subject, user_body)
        
        return jsonify(saved_message), 201

@app.route('/api/messages/<int:message_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_message(message_id):
    """Get, update, or delete a specific message"""
    messages = load_messages()
    message = next((m for m in messages if m['id'] == message_id), None)
    
    if not message:
        return jsonify({"error": "Message not found"}), 404
    
    if request.method == 'GET':
        return jsonify(message)
    
    elif request.method == 'PUT':
        # Update message status (e.g., mark as read)
        updated_data = request.json
        for i, m in enumerate(messages):
            if m['id'] == message_id:
                messages[i].update(updated_data)
                break
        with open(MESSAGES_FILE, 'w') as f:
            json.dump(messages, f, indent=2)
        return jsonify(messages[i])
    
    elif request.method == 'DELETE':
        messages = [m for m in messages if m['id'] != message_id]
        with open(MESSAGES_FILE, 'w') as f:
            json.dump(messages, f, indent=2)
        return jsonify({"message": "Message deleted"}), 200

# Chatbot Request Notification Route

@app.route('/api/chatbot/notify', methods=['POST'])
def chatbot_notify():
    """Handle chatbot requests that require admin notification"""
    data = request.json
    
    # Validate required fields
    if 'type' not in data or 'content' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Save as message
    message_data = {
        "name": data.get('name', 'Chatbot User'),
        "email": data.get('email', 'chatbot@system'),
        "message": f"[Chatbot Request - {data['type']}] {data['content']}",
        "source": "chatbot"
    }
    saved_message = save_message(message_data)
    
    # Send email notification to admin
    admin_email = os.getenv('ADMIN_EMAIL', 'info@dohanmedicare.com')
    subject = f"Chatbot Request: {data['type']}"
    body = f"""
    <html>
    <body>
        <h2>New Chatbot Request</h2>
        <p><strong>Type:</strong> {data['type']}</p>
        <p><strong>Content:</strong></p>
        <p>{data['content']}</p>
        <p><strong>User Info:</strong> {data.get('name', 'N/A')} ({data.get('email', 'N/A')})</p>
        <p><strong>Timestamp:</strong> {saved_message['timestamp']}</p>
    </body>
    </html>
    """
    send_email_notification(admin_email, subject, body)
    
    return jsonify({"status": "notification sent", "message_id": saved_message['id']}), 201

if __name__ == '__main__':
    # Run on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)

