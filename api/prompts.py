def get_summary_prompt(data):
    return (
        f"Please summarize each of these websites {data['websites']}. Please include the URL for each website."
    )

def get_study_guide_prompt(data):
    return (
        f"Please create study guide questions for each of these websites: {data['websites']}"
    )

def get_general_prompt(data):
    return (
        f"Please answer this prompt \"{data['prompt']}\". Use these websites in your response if possible - {data['websites']}"
    )

def get_research_direction_prompt(data):
    return (
        f"Please me some good research directions from these websites: {data['websites']}"
    )

def get_project_ideas_prompt(data):
    return (
        f"Please give me some good, basic, Information Retrieval project ideas that use the concepts mentioned in these websites: {data['websites']}"
    )