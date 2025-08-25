- **THIS PROJECT CREATE BY GEMINI PRO**

## create env
```
python -m venv mdm_env  
source mdm_env/bin/activate  # macOS/Linux
pip install django djangorestframework django-environ
git clone https://github.com/hqw700/android-mdm
```

## start server
```
cd android-mdm
python manage.py runserver
```
open `http://127.0.0.1:3000/`

## start frontend
```
cd mdm-frontend
npm start
```

## install app
```
cd mdm-client
./gradlew assemble
adb install ./app/build/outputs/apk/debug/app-debug.apk
```
