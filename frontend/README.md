Frontend – Deep Dive Video & Meeting Note Taker

This is the frontend for the AI-powered Deep Dive Video & Meeting Note Taker. It provides a fast, responsive, and intuitive interface for uploading content, viewing structured notes, and interacting with AI-generated insights.

Built using React and Vite, the frontend focuses on performance, modularity, and user experience.

⸻

Overview

The frontend enables users to:

* Input YouTube links or upload media files
* View AI-generated summaries and structured notes
* Navigate content using timestamped insights
* Search within transcripts using semantic queries
* Track extracted action items

It is designed to feel like a real-world SaaS product with a clean and minimal interface.

⸻

Tech Stack

* React (Vite)
* Tailwind CSS
* Axios (API communication)
* React Router (navigation)
* Recharts / Chart.js (data visualization)

⸻

Features

Input Interface

* Accept YouTube URLs and file uploads
* Clean and simple input flow

Video + Notes Layout

* Split screen interface:
    * Video player (left)
    * Notes and insights (right)

Structured Notes Viewer

* Sectioned summaries with headings and bullet points
* Toggle between summary modes (planned)

Timestamp Navigation

* Clickable timestamps
* Jump directly to relevant video segments

Transcript Viewer

* Full transcript with timestamps
* Highlight important sections

Action Items Panel

* Displays extracted:
    * Tasks
    * Ideas
    * Questions

Semantic Search UI

* Ask questions about the content
* Displays contextual answers from backend (RAG)

Responsive Design

* Works across desktop and mobile
* Optimized for readability and usability
