import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { Client } from '@microsoft/microsoft-graph-client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // try {
  //   const client = Client.init({
  //     authProvider: (done) => {
  //       done(null, YOUR_TOKEN); // pass the token
  //     },
  //   });

    // Get the 10 latest messages
    const messages = await client.api('/me/mailfolders/inbox/messages').filter('isRead eq false').top(10).get();

    // Process each message
    for (const message of messages.value) {
      const { id, subject, body } = message;

      // Create the vector store
      const index = pinecone.Index(PINECONE_INDEX_NAME);
      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
          pineconeIndex: index,
          textKey: 'text',
          namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
        },
      );

      // Create the chain
      const chain = makeChain(vectorStore);
      // Ask a question using chat history
      const response = await chain.call({
        question: body.content, // use the email content as the question
        chat_history: [], // use an empty history for now
      });

      // Send a reply
      await client.api(`/me/messages/${id}/reply`).post({
        comment: response.answer
      });

      // Mark the message as read
      await client.api(`/me/messages/${id}`).patch({ isRead: true });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
