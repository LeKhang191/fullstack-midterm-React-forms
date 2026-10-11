# Ex1: Create Django project and endpoint /health

## Environment requirement
- Python 3.10 above
- Django (version that write in `requirements.txt`)

## How to run
```bash
cd Source/mini-app
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py test           # run auto testing
python manage.py runserver      # server start
```
open `http://127.0.0.1:8000/health` or using curl:
```bash
curl -i http://127.0.0.1:8000/health
```

## Output
```
HTTP/1.1 200 OK
Content-Type: application/json

{"status": "ok"}
```

## Illustrate image