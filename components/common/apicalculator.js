// This would be in the page component file where you need the posts data.

export async function getStaticProps() {
  try {
    // Fetch the data from the API endpoint
    const res = await fetch(`api/random-document?all=true`);
    if (!res.ok) {
      throw new Error(`Failed to fetch posts, received status ${res.status}`);
    }
    const posts = await res.json();

    // Map the fields from the documents if you need to limit the fields
    const fields = ["slug", "title", "content" /* other fields you need */];
    const mappedPosts = posts.map((post) => {
      const mappedPost = {};
      fields.forEach((field) => {
        if (field === "slug") {
          mappedPost[field] = post.web_id.toString();
        } else if (post[field]) {
          mappedPost[field] = post[field];
        }
      });
      return mappedPost;
    });

    return {
      props: {
        posts: mappedPosts,
      },
      revalidate: 10, // In seconds, if you want to revalidate the data periodically
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      props: {
        error: "Failed to fetch posts.",
      },
    };
  }
}
