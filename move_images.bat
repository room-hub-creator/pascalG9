@echo off
echo --- Academic Team Image Sync ---
echo Moving team images to public folder for web visibility...

if exist ISHIMWE.jpg move /Y ISHIMWE.jpg public\
if exist UWERA.jpeg move /Y UWERA.jpeg public\
if exist UKUNDIMANA.jpeg move /Y UKUNDIMANA.jpeg public\
if exist MUTUYIMANA.jpeg move /Y MUTUYIMANA.jpeg public\
if exist TUYISHIME.jpeg move /Y TUYISHIME.jpeg public\
if exist MBONIGABA.jpeg move /Y MBONIGABA.jpeg public\
if exist Ananie.jpeg move /Y Ananie.jpeg public\

echo.
echo Process complete. Faces should now be clear and centered from the top!
pause
