import google.generativeai as genai
from app.core.config import settings
from typing import List, Dict, Any, Optional
import json

class LLMService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def summarize(self, text: str, mode: str) -> str:
        """
        Generates a summary based on the requested mode using Gemini.
        """
        prompts = {
            "quick": "Give a 5-bullet TL;DR summary of this transcript.",
            "structured": "Generate structured deep notes with Headings, Subtopics, Key points, and Examples.",
            "exam": "Generate exam revision notes: Concepts, definitions, formulas, and Q&A pairs.",
            "meeting": "Extract meeting details: Decisions made, open questions, and owner assignments.",
            "eli5": "Explain the content like I'm 5 years old.",
            "executive": "Create a 1-page business brief including decisions and next steps."
        }
        
        prompt = prompts.get(mode, prompts["quick"])
        
        if not self.model:
            return f"Gemini API key not configured. Content summary for mode: {mode}"

        response = self.model.generate_content(f"{prompt}\n\nTranscript:\n{text}")
        return response.text

    def extract_intelligence(self, text: str) -> Dict[str, Any]:
        """
        Extracts action items and concepts from the transcript using Gemini.
        """
        if not self.model:
            return {"action_items": [], "concepts": []}

        # Gemini 1.5 performs very well with JSON instructions in the prompt
        prompt = f"""
        Extract actionable intelligence from the following transcript. 
        Return the result ONLY as a JSON object with these keys: 
        "action_items": [{{ "content": string, "type": "task"|"follow-up"|"decision"|"question", "assignee": string|null }}]
        "concepts": [{{ "name": string, "description": string }}]

        Transcript:
        {text}
        """
        
        response = self.model.generate_content(prompt)
        
        # Simple cleanup in case Gemini adds markdown backticks
        json_str = response.text.strip()
        if json_str.startswith("```json"):
            json_str = json_str[7:-3].strip()
        elif json_str.startswith("```"):
            json_str = json_str[3:-3].strip()
            
        try:
            return json.loads(json_str)
        except:
            return {"action_items": [], "concepts": []}

llm_service = LLMService()
