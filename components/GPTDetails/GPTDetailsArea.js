import React, { useEffect, useState } from "react";
import gptSideBar from "../GPT/GPTSideBar";
import Link from "next/link";
import styled from "styled-components";

const CategoryButton = styled.button`
  background-color: ${(props) => props.color};
  border: none;
  padding: 8px 16px;
  margin: 2px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  text-transform: capitalize;
  &:hover {
    opacity: 0.8;
  }
`;
const InfoButton = styled.span`
  display: inline-block;
  background-color: #e0e0e0;
  color: white;
  border-radius: 50%;
  padding: 0.2em 0.5em;
  font-size: 0.8em;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  margin-left: 8px;
  vertical-align: middle;
  cursor: pointer;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  &:hover::after {
    color: #fff;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 100%;
    padding: 4px 8px;
    border-radius: 6px;
    background-color: #616161; /* A shade of dark gray */
    white-space: nowrap;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    font-size: 0.75em;
    margin-bottom: 5px;
  }
`;
const VisitButton = styled.a`
  padding: 8px 16px;
  margin: 2px;
  background-color: #4caf50; /* Green background */
  color: white; /* White text */
  text-decoration: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  display: inline-block; /* Allows padding and margin to work like a button */
  &:hover {
    background-color: #45a045; /* Darker green on hover */
  }
`;

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

  // When the component mounts and when webId changes, fetch the GPT details
  useEffect(() => {
    async function fetchGptDetails() {
      try {
        const response = await fetch(`/api/random-document?web_id=${webId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPost({
          ...data,
          // Ensure Tags is an array by splitting the string
          Tags: data.Tags ? data.Tags.split(",").map((tag) => tag.trim()) : [],
        });
        setLikes(data.likes || 0);
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
            {Array.isArray(post.Tags) && post.Tags.length > 0 && (
              <div
                className="tags-container"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span className="tags-label" style={{ marginRight: "10px" }}>
                  Tags:
                </span>
                {post.Tags.map((tag, index) => (
                  <CategoryButton key={index} color={getRandomLightColor()}>
                    {tag}
                  </CategoryButton>
                ))}
              </div>
            )}
            <div className="likes-section flex justify-content-between">
              <div>
                <button onClick={incrementLikes} className="like-button">
                  ❤️
                </button>
                <span className="likes-count">{likes} Likes</span>
                <InfoButton title="Click heart to like">i</InfoButton>
              </div>

              {post.ChatGPTLink && (
                <VisitButton
                  href={post.ChatGPTLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to ChatGPT
                </VisitButton>
              )}
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
