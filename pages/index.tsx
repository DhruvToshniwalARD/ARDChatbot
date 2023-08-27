import { useRef, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Welcome to Orbit Research! How may I assist you?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  function speakText(text: string) {
    if ('speechSynthesis' in window) {
      let utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';  // Set language, you can modify as needed.
      window.speechSynthesis.speak(utterance);
    }
  }  

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();
  
    setError(null);
  
    if (!query) {
      alert('Please input a question');
      return;
    }
  
    const question = query.trim();
  
    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));
  
    setLoading(true);
    setQuery('');
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
        }),
      });
      const data = await response.json();
  
      if (data.error) {
        setError(data.error);
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }
      setLoading(false);
  
      //scroll to bottom
      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
  
      // Set focus back to the textarea after processing message
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 100);
      console.log(document.activeElement === textAreaRef.current);
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching the data. Please try again.');
      
      // Also set focus back to the textarea if there's an error
      textAreaRef.current?.focus();
    }
  }

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };
  return (
    <Layout>
      <div className="mx-auto flex flex-col gap-4">
        <main className={styles.main}>
          
          {/* Display for JAWS accessibility */}
          <div aria-live="polite">
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.type === 'userMessage' ? 'Query' : 'Response'}:</strong> {msg.message}
              </p>
            ))}
          </div>
          <div className={styles.center}>
            <div className={styles.cloudform}>
              <form onSubmit={handleSubmit}>
                <label htmlFor="userInput" className="sr-only">
                  Please ask your questions here
                </label>
                <textarea
                  disabled={loading}
                  onKeyDown={handleEnter}
                  ref={textAreaRef}
                  autoFocus={true}
                  rows={1}
                  maxLength={512}
                  id="userInput"
                  name="userInput"
                  placeholder={
                    loading
                      ? 'Formulating a response..'
                      : 'Please ask your questions here.'
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={styles.textarea}
                  aria-required="true"
                  aria-label="User input for questions"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.generatebutton}
                  aria-label="Send message"
                >
                  {loading ? (
                    <LoadingDots color="#000" />
                  ) : (
                    <svg
                      viewBox="0 0 20 20"
                      className={styles.svgicon}
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>
  
          {error && (
            <div className="border border-red-400 rounded-md p-4">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );  
}