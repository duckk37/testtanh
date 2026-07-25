from fastapi import APIRouter, HTTPException
from youtube_transcript_api import YouTubeTranscriptApi

router = APIRouter(tags=["Video"])

@router.get("/video/transcript")
def get_video_transcript(video_id: str):
    """
    Fetch subtitles for a given YouTube video ID.
    Prioritizes English subtitles if available.
    """
    try:
        # Fetch transcript
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        try:
            transcript = transcript_list.find_transcript(['en'])
        except Exception:
            # If English is not found, get the first available one and translate to English
            # or just get the default one
            transcript = transcript_list.find_transcript(['en-US', 'en-GB'])
            
        data = transcript.fetch()
        return data
    except Exception as e:
        # If no manual transcripts, try auto-generated
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
            return transcript
        except Exception as ex:
            raise HTTPException(status_code=400, detail=f"Cannot fetch subtitles: {str(ex)}")
