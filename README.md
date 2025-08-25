- **THIS PROJECT CREATE BY GEMINI PRO**

## create env
```
python -m venv mdm_env
cd mdm_env
source bin/activate  # macOS/Linux
pip install django djangorestframework django-environ pip3 install django-cors-headers
git clone https://github.com/hqw700/android-mdm
```

## start server
```
cd android-mdm
python manage.py migrate
python manage.py runserver
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
