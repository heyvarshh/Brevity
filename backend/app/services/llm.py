from openai import OpenAI
from app.core.config import settings
from typing import List, Dict, Any, Optional
import json

class LLMService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    def summarize(self, text: str, mode: str) -> str:
        """
        Generates a summary based on the requested mode.
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
        
        if not self.client:
            return f"LLM client not configured. Content summary for mode: {mode}"

        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a brilliant intelligence partner that understands content deeply."},
                {"role": "user", "content": f"{prompt}\n\nTranscript:\n{text}"}
            ]
        )
        return response.choices[0].message.content

    def extract_intelligence(self, text: str) -> Dict[str, Any]:
        """
        Extracts action items and concepts from the transcript using tool calling/JSON mode.
        """
        if not self.client:
            return {"action_items": [], "concepts": []}

        tools = [
            {
                "type": "function",
                "function": {
                    "name": "extract_intelligence",
                    "description": "Extracts actionable items and key concepts from text",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "action_items": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "content": {"type": "string"},
                                        "type": {"type": "string", "enum": ["task", "follow-up", "decision", "question"]},
                                        "assignee": {"type": "string"}
                                    }
                                }
                            },
                            "concepts": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "name": {"type": "string"},
                                        "description": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]

        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": text}],
            tools=tools,
            tool_choice={"type": "function", "function": {"name": "extract_intelligence"}}
        )
        
        # Parse result
        tool_call = response.choices[0].message.tool_calls[0]
        return json.loads(tool_call.function.arguments)

llm_service = LLMService()
