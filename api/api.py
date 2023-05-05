import os
import json 
import requests


from flask_cors import CORS
from flask import (
    Flask,
    request,
    jsonify,
)

app = Flask(__name__)
CORS(app)

from chatgpt_wrapper import OpenAIAPI

from prompts import get_summary_prompt, get_study_guide_prompt, get_general_prompt, get_research_direction_prompt, get_project_ideas_prompt

def setup_model(**kwargs):

    api_key_file = kwargs.get("api_key_file", "secret.key")
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

@app.route('/cdl_proxy', methods=['POST'])
def cdl_proxy():
    NEXTJS_BUILD_ID = 'kHpFSi5J1QZ_yapKDCt87'
    token = request.json['token']
    query = request.json['query']
    community = request.json['community']
    cdl_response = requests.get(
        url=f'https://textdata.org/_next/data/{NEXTJS_BUILD_ID}/search.json?query={query}&community={community}&page=0',
        cookies={ 'token': token }
    )
    return cdl_response.json()

@app.route('/general_prompt', methods=['GET', 'POST'])
def general_prompt_endpoint():
    """ Generates a study guide for each webpage from ChatGPT """
    """ Assuming API input is a list of links """
    if request.method == "POST":
        data = request.data
        if data:
            data = json.loads(data.decode("utf-8"))

            general_prompt = get_general_prompt(data)
            success, general_answer, message = chatGPT.ask(general_prompt)
            if not success:
                return message
            
            
            response = jsonify({
                'websites': data['websites'],
                'general_prompt': data['prompt'],
                'general_answer': general_answer
            })

            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        return "Invalid input"

@app.route('/get_research_directions', methods=['GET', 'POST'])
def research_directions_endpoint():
    """ Produces Research Directions from the papers feed to it """
    """ Assuming API input is a list of links """
    if request.method == "POST":
        data = request.data
        if data:
            data = json.loads(data.decode("utf-8"))

            research_direction_prompt = get_research_direction_prompt(data)
            success, research_directions, message = chatGPT.ask(research_direction_prompt)
            if not success:
                return message
            
            
            response = jsonify({
                'websites': data['websites'],
                'research_directions': research_directions
            })

            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        return "Invalid input"

@app.route('/get_project_ideas', methods=['GET', 'POST'])
def project_ideas_endpoint():
    """ Produces Research Directions from the papers feed to it """
    """ Assuming API input is a list of links """
    if request.method == "POST":
        data = request.data
        if data:
            data = json.loads(data.decode("utf-8"))

            project_ideas_prompt = get_project_ideas_prompt(data)
            success, project_ideas, message = chatGPT.ask(project_ideas_prompt)
            if not success:
                return message
            
            
            response = jsonify({
                'websites': data['websites'],
                'project_ideas': project_ideas
            })

            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        return "Invalid input"