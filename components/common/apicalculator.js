// Assuming that your API endpoints are structured as follows:
// GET /api/posts -> returns all posts
// GET /api/posts/[slug] -> returns a single post by slug

export async function getPostBySlug(slug) {
  // Replace `process.env.API_URL` with your actual API base URL
  const res = await fetch(
    `${process.env.SITE_URL}/api/random-document?web_id=${params.slug}`
  );
  const post = await res.json();
  return post;
}

export async function getAllPosts() {
  // Replace `process.env.API_URL` with your actual API base URL
  const res = await fetch(
    `${process.env.SITE_URL}/api/random-document?all=true`
  );
  const allPosts = await res.json();

  // If you need to sort posts by date or perform other transformations, do so here
  // Example: Sort by date in descending order if each post has a 'date' field
  allPosts.sort(
    (post1, post2) => new Date(post2.web_id) - new Date(post1.web_id)
  );

  return allPosts;
}
