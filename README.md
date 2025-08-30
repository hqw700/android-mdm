# Android MDM (Mobile Device Management)

- **THIS PROJECT CREATE BY GEMINI PRO**

This project is a simple Mobile Device Management (MDM) solution for Android devices, built with Django (backend), React (frontend), and a native Android client app.

## Features

*   Device registration and management
*   Remote device locking
*   Real-time online status check using JPush
*   View device information, including tags and alias from JPush

## Project Structure

*   `mdm_server`: Django backend
*   `mdm-frontend`: React frontend
*   `mdm-client`: Android client app

## Setup and Installation

### 1. Backend Setup (Django)

1.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv mdm_env
    source mdm_env/bin/activate  # On Windows, use `mdm_env\Scripts\activate`
    ```

2.  **Clone the repository:**
    ```bash
    git clone https://github.com/hqw700/android-mdm.git
    cd android-mdm
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure environment variables:**
    Create a `.env` file in the project root directory and add the following:
    ```
    # Django Settings
    DJANGO_SECRET_KEY='your-secret-key'
    DEBUG=True
    ALLOWED_HOSTS=127.0.0.1,localhost
    CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

    # JPush Settings
    JPUSH_APP_KEY=your_jpush_app_key
    JPUSH_MASTER_SECRET=your_jpush_master_secret
    ```
    **Note:** Replace the placeholder values with your actual Django secret key and JPush credentials.

5.  **Run database migrations:**
    ```bash
    python manage.py migrate
    ```

6.  **Start the backend server:**
    ```bash
    python manage.py runserver 0.0.0.0:8000
    ```

### 2. Frontend Setup (React)

1.  **Navigate to the frontend directory:**
    ```bash
    cd mdm-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The frontend will be available at `http://localhost:3000`.

### 3. Android Client Setup

1.  **Navigate to the Android client directory:**
    ```bash
    cd mdm-client
    ```

2.  **Build the APK:**
    ```bash
    ./gradlew assembleDebug
    ```

3.  **Install the APK on your device:**
    ```bash
    adb install app/build/outputs/apk/debug/app-debug.apk
    ```

## Remote Control Commands

You can send commands to the devices using the API. The following commands are currently supported:

*   **Remote Lock:**
    -   **Endpoint:** `POST /api/devices/{registration_id}/command/`
    -   **Body:** `{"command": "lock"}`