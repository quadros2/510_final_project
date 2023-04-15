import os
import json 

from flask_cors import CORS
from flask import (
    Flask,
    request,
    jsonify,
)

from prompts import get_summary_prompt, get_study_guide_prompt

def setup_model(**kwargs):

    api_key_file = kwargs.get("api_key_file", "api/secret.key")
    with open(api_key_file, "r") as f:
        api_key = f.readline().strip()

        if not len(api_key):
            return None

        os.environ["OPENAI_API_KEY"] = api_key

    bot = OpenAIAPI()
    model = bot

    return model

chatGPT = setup_model()

@app.route('/summarize', methods=['GET', 'POST'])
def summary_endpoint():
    """ Gets summary of webpages from ChatGPT """
    """ Assuming API input is a list of links """
    if request.method == "POST":
        data = request.data
        if data:
            data = json.loads(data.decode("utf-8"))

            summary_prompt = get_summary_prompt(data)
            success, summaries, message = chatGPT.ask(summary_prompt)
            if not success:
                return message
            
            
            response = jsonify({
                'websites': data['websites'],
                'summaries': summaries
            })

            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        return "Invalid input"

@app.route('/make_study_guide', methods=['GET', 'POST'])
def study_guide_endpoint():
    """ Generates a study guide for each webpage from ChatGPT """
    """ Assuming API input is a list of links """
    if request.method == "POST":
        data = request.data
        if data:
            data = json.loads(data.decode("utf-8"))

            study_guide_prompt = get_study_guide_prompt(data)
            success, study_guides, message = chatGPT.ask(study_guide_prompt)
            if not success:
                return message
            
            
            response = jsonify({
                'websites': data['websites'],
                'study_guides': study_guides
            })

            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        return "Invalid input"