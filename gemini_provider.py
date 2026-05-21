import google.generativeai as genai
import time

from app.core.config import settings
from app.services.llm.providers.base_provider import BaseLLMProvider


genai.configure(
    api_key=settings.GEMINI_API_KEY
)


class GeminiProvider(BaseLLMProvider):

    def __init__(self):

        self.model = genai.GenerativeModel(
            "gemini-1.5-flash"
        )

   


def generate(
    self,
    prompt: str
) -> str:

    retries = 3

    for attempt in range(retries):

        try:

            response = self.model.generate_content(
                prompt
            )

            return response.text

        except Exception as e:

            print(f"Retry {attempt+1}: {e}")

            time.sleep(5)

    raise Exception(
        "LLM generation failed after retries"
    )