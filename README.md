Here is the full README.md file:

```markdown
# My Project

This project is a chatbot powered by LangChain, Pinecone, and OpenAI. It allows you to search through PDF documents using natural language queries. 

## Setup

### Clone the repo

```
git clone <github url>
```

### Install dependencies

```
npm install
npm install yarn -g
yarn install 
```

After installation, you should see a `node_modules` folder.

### Set up environment variables 

Copy `.env.example` to `.env` and add your API keys:

```
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=  
PINECONE_INDEX_NAME=
```

Visit [openai](https://openai.com) to retrieve API keys and insert into your `.env` file.

Visit [pinecone](https://www.pinecone.io/) to create and retrieve your API keys, environment, and index name from the dashboard.

In `config/pinecone.ts`, replace `PINECONE_NAMESPACE` with your desired namespace. This will be used later for queries and retrieval.

In `utils/makechain.ts` chain, update `QA_PROMPT` for your own use case. 

### Add PDFs

This repo can load multiple PDF files. 

Inside `docs/` folder, add your pdf files or folders containing pdfs.

Run `npm run ingest` to 'ingest' and embed your docs. 

Check Pinecone dashboard to verify your namespace and vectors have been added.

### Start the app

Once you've verified successful ingestion, you can run:

```
npm run dev
```

to launch the local dev environment. 

You can now ask questions in the chat interface.

## Troubleshooting

- Make sure API keys are valid
- Try different PDFs
- Check Pinecone dashboard for successful ingestion  
- Match env variables and config
- Use latest versions of dependencies
- Check OpenAI credits
- Log env variables to check values
- Use same Pinecone and LangChain versions as repo
- Check OpenAI model access matches config

## Exposing locally 

To expose localhost publicly:

```
ngrok http --domain=https://<subdomain>.ngrok.io 8080 
```

Use the credentials for your [ngrok](https://ngrok.com) account or the free tier.
```
