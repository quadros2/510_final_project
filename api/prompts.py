def get_summary_prompt(data):
    return (
        f"Please summarize each of these websites {data['websites']}. Please include the URL for each website."
    )

def get_study_guide_prompt(data):
    return (
        f"Please create study guide questions for each of these websites: {data['websites']}. Please include the URL for each website."
    )