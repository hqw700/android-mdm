- **THIS PROJECT CREATE BY GEMINI PRO**

## create env
```
python -m venv mdm_env
cd mdm_env
source bin/activate  # macOS/Linux
pip install django djangorestframework django-environ pip3 install django-cors-headers dotenv
git clone https://github.com/hqw700/android-mdm
```
- add `.env` file
```
# Django Settings
# NOTE: For production, generate a new, truly random secret key.
DJANGO_SECRET_KEY='django-insecure-iyqeid+1e4b^e7p0a3y+3xs7b%cnl)zh9nw&zrce-oiuk^9aam'

# Set to False in production
DEBUG=True

# Comma-separated list of allowed hosts for Django. 
# Add your server's IP or domain here when deploying.
ALLOWED_HOSTS=127.0.0.1,localhost,192.168.5.84

# Comma-separated list of allowed origins for CORS. 
# Add your frontend's URL here when deploying.
CORS_ALLOWED_ORIGINS=http://127.0.0.1:3000,http://localhost:3000,http://192.168.5.84:3000
```

## start server
```
cd android-mdm
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

## start frontend
```
cd mdm-frontend
npm install react-scripts
npm start
```
open `http://127.0.0.1:3000/`

## install app
```
cd mdm-client
./gradlew assemble
adb install ./app/build/outputs/apk/debug/app-debug.apk
```
