#!/bin/bash
# Download TextBlob corpora before starting the app
python -m textblob.download_corpora

# Start FastAPI app
uvicorn main:app --host 0.0.0.0 --port 10000
