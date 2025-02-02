# My Project

This project is a chatbot powered by LangChain, Pinecone, and OpenAI. It allows you to search through PDF documents using natural language queries.

## 🚀 Setup

Clone the repo or download the ZIP

Install packages
First run npm install yarn -g to install yarn globally (if you haven't already).
Then run:
yarn install
After installation, you should now see a node_modules folder.

Set up your .env file
Copy .env.example into .env Your .env file should look like this:
OPENAI_API_KEY=

PINECONE_API_KEY=
PINECONE_ENVIRONMENT=

PINECONE_INDEX_NAME=

Visit openai to retrieve API keys and insert into your .env file.
Visit pinecone to create and retrieve your API keys, and also retrieve your environment and index name from the dashboard.
In the config folder, replace the PINECONE_NAME_SPACE with a namespace where you'd like to store your embeddings on Pinecone when you run npm run ingest. This namespace will later be used for queries and retrieval.

In utils/makechain.ts chain change the QA_PROMPT for your own usecase (NOT NEEDED). Change modelName in new OpenAI to gpt-4, if you have access to gpt-4 api (Not cost effective).

Convert your PDF files to embeddings
This repo can load multiple PDF files
Inside docs folder, add your pdf files or folders that contain pdf files.
Run the script npm run ingest to 'ingest' and embed your docs. If you run into errors troubleshoot below.

Check Pinecone dashboard to verify your namespace and vectors have been added.

Run the app
Once you've verified that the embeddings and content have been successfully added to your Pinecone, you can run the app npm run dev to launch the local dev environment, and then type a question in the chat interface.

 ![gpt-langchain-pdf](https://github.com/DhruvToshniwalARD/ARDChatbot/assets/135351921/d6e4d823-a5bc-485b-9301-24da5af4decb)

Troubleshooting
In general, keep an eye out in the issues and discussions section of this repo for solutions.

General errors

Make sure you're running the latest Node version. Run node -v
Try a different PDF or convert your PDF to text first. It's possible your PDF is corrupted, scanned, or requires OCR to convert to text.
Console.log the env variables and make sure they are exposed.
Make sure you're using the same versions of LangChain and Pinecone as this repo.
Check that you've created an .env file that contains your valid (and working) API keys, environment and index name.
If you change modelName in OpenAI, make sure you have access to the api for the appropriate model.
Make sure you have enough OpenAI credits and a valid card on your billings account.
Check that you don't have multiple OPENAPI keys in your global environment. If you do, the local env file from the project will be overwritten by systems env variable.
Try to hard code your API keys into the process.env variables if there are still issues.
Pinecone errors

Make sure your pinecone dashboard environment and index matches the one in the pinecone.ts and .env files.
Check that you've set the vector dimensions to 1536.
Make sure your pinecone namespace is in lowercase.
Pinecone indexes of users on the Starter(free) plan are deleted after 7 days of inactivity. To prevent this, send an API request to Pinecone to reset the counter before 7 days.
Retry from scratch with a new Pinecone project, index, and cloned repo.

Install ngrok - https://ngrok.com/download
Use the credentials for the ngrok account or the free one will work for 2 hours.

After running npm run dev, use this command to expose localhost to the internet.
ngrok http --domain=orbitresearch.ngrok.dev 3000
