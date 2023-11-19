import React, { useEffect, useState } from "react";
import gptSideBar from "../GPT/GPTSideBar";
import Link from "next/link";

const getRandomLightColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 30);
  const lightness = 80 + Math.floor(Math.random() * 20);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const GptDetailsArea = ({ webId }) => {
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0); // State to keep track of likes
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGptDetails() {
      try {
        const response = await fetch(`/api/random-document?web_id=${webId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPost(data);
        setLikes(data.likes || 0); // Initialize likes from the data, default to 0 if undefined
      } catch (error) {
        setError(error.message);
      }
    }

    fetchGptDetails();
  }, [webId]);

  const incrementLikes = async () => {
    try {
      const response = await fetch("/api/incrementLikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ web_id: webId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.message) {
        setLikes((likes) => likes + 1); // Increment likes in the UI
      }
    } catch (error) {
      setError(error.message);
    }
  };

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
            <p className="card-by">
              Category:
              <Link href={`/category/${encodeURIComponent(post.Category)}`}>
                <a
                  className="category-button"
                  style={{ backgroundColor: getRandomLightColor() }}
                >
                  {post.Category}
                </a>
              </Link>
            </p>
            <div className="likes-section">
              <button onClick={incrementLikes} className="like-button">
                ❤️
              </button>
              <span className="likes-count">{likes} Likes</span>
            </div>
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
              Use {post.Title} on ChatGPT
            </a>
          </div>
        </div>
      </div>
      <gptSideBar post={post} />
    </div>
  );
};

export default GptDetailsArea;
