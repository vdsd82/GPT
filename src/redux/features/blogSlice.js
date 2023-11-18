import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts } from "../../components/common/apicalculator";
import blogData from "../../data/blogData";


export const blogSlice = createSlice({
    name: 'blog',
    initialState:{
        blogs:getAllPosts,
        specificItem:blogData[0],
    },
    reducers: {
      specificBlog: (state, action) => {
        state.specificItem = state.blogs.find(blog => blog.id === action.payload)
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { specificBlog } = blogSlice.actions;
  
  export default blogSlice.reducer;