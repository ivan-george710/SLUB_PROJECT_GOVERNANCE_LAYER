import ollama


class OllamaProvider:

    def __init__(self):

        self.model = "mistral"

    def generate(
        self,
        prompt: str
    ):

        response = ollama.chat(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response["message"]["content"]