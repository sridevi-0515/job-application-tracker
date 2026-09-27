$project = "C:\Users\acer\OneDrive\Desktop\job_application_tracker"

Write-Host "Starting Job Application Tracker..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$project\backend'; .\venv\Scripts\Activate.ps1; python manage.py runserver"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$project\express-server'; npm start"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$project\frontend'; npm run dev"

Write-Host "Django, Express and React are starting..." -ForegroundColor Green