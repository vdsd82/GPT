import React, { useEffect, useState } from "react";
import Link from "next/link";
import gptSideBar from "../gpt/gptSideBar";

const GptDetailsArea = ({ webId }) => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGptDetails() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/random-document?web_id=${webId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchGptDetails();
    console.log("test", post);
  }, [webId]);

  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Loading...</div>;

  return (
    <div className="content-area">
      <div className="main-content">
        <div className="card">
          <div className="card-header">
            <img src={post.Picture} alt={post.Title} className="card-logo" />
            <h2 className="card-title">{post.Title}</h2>
            <p className="card-by">
              By{" "}
              <a
                href={post.Author.URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {post.Author.Name}
              </a>
            </p>
            <p className="card-by">Category: {post.Category}</p>
          </div>
          <div className="card-body">
            <h3>Description</h3>
            <p>{post.Description}</p>
            <h3>Welcome Message</h3>
            <p>{post.WelcomeMessage}</p>
            <h3>Prompt Starters</h3>
            <ul>
              {post.PromptStarters.map((starter, index) => (
                <li key={index}>{starter}</li>
              ))}
            </ul>
            <h3>Tools Used</h3>
            <ul>
              {post.ToolsUsed.map((starter, index) => (
                <li key={index}>{starter}</li>
              ))}
            </ul>
          </div>
          <div className="card-footer">
            <a href={post.ChatGPTLink} className="card-link">
              Use API Docs on ChatGPT
            </a>
          </div>
        </div>
      </div>
      <gptSideBar post={post} />
    </div>
  );
};

export default GptDetailsArea;
