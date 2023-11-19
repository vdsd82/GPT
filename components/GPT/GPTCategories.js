import React from "react";
import styled from "styled-components";

// Function to generate random light colors
const getRandomLightColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 30);
  const lightness = 80 + Math.floor(Math.random() * 20);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Styled components
const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  @media (min-width: 768px) {
    width: 70%;
  }
  margin: auto;
`;

const CategoryButton = styled.button`
  background-color: ${(props) => props.color};
  border: none;
  padding: 8px 16px;
  margin: 4px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  text-transform: capitalize;
  &:hover {
    opacity: 0.8;
  }
`;

// CategoryButtons component
const CategoryButtons = () => {
  const categories = [
    "Miscellaneous",
    "Art & Design",
    "Entertainment & Gaming",
    "Search & Discovery",
    "Consulting Services",
    "Programming & Development",
    "Content Creation",
    "Educational Resources",
    "Automation & Bots",
    "Coaching & Self-improvement",
    "Branding & Marketing",
    "Professional Services",
    "Expert Systems",
    "Design & Illustration",
    "Creative Tools",
    "Data Analysis",
    "Law & Governance",
    "Productivity Tools",
    "Product Management",
    "Navigation & Maps",
    "Education & Learning",
    "Advanced Technology",
    "Food & Culinary",
    "Creative Writing",
    "News & Media",
    "Language & Translation",
    "Health & Wellness",
    "Architecture & Construction",
    "SEO & Marketing",
    "Exploration & Research",
    "Astrology & Esoterics",
    "Travel & Geography",
    "Imaging & Photography",
    "Psychology & Social Sciences",
    "Science & Research",
    "Engineering & Industry",
    "Fashion & Style",
    "Music & Audio",
    "Finance & Economics",
    "Fitness & Sports",
    "Literature & Writing",
    "Technology & Innovation",
  ];

  const handleCategoryClick = (category) => {
    // Redirect to the category page
    window.location.href = `/category/${encodeURIComponent(category)}`;
  };
  return (
    <div className="categories-container">
      {categories.map((category, index) => (
        <button
          key={index}
          className="category-button"
          style={{ backgroundColor: getRandomLightColor() }} // Inline style for dynamic background color
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryButtons;
