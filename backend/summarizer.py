# from transformers import pipeline

# # Initialize Hugging Face summarizer pipeline (downloads model first time)
# summarizer = pipeline("summarization", model="t5-small")

# def summarize_text(text):
#     # Optional: limit input text if too long (T5-small accepts ~512 tokens max)
#     trimmed_text = text[:1000]  

#     # Generate summary
#     summary = summarizer(trimmed_text, max_length=150, min_length=30, do_sample=False)
    
#     return summary[0]['summary_text']

from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text):
    trimmed_text = text[:1024]  # bart-large accepts up to ~1024 tokens
    summary = summarizer(trimmed_text, max_length=180, min_length=40, do_sample=False)
    return summary[0]['summary_text']


