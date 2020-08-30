import React, { useState, useEffect, useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

const EXCHANGE_RATES = gql`
  query {
    blogs {
      id,
      title,
      description,
    }
  }
`;

const LOAD_COMMENT = gql`
  query ($blog_id: Int!){
    comments(blog_id: $blog_id) {
      id,
      comment
    }
  }
`;

function App() {
  const [blogs, setBlogs] = useState([]);
  const client = useApolloClient();

  const fectData = useCallback(async () => {
    const { data } = await client.query({
      query: EXCHANGE_RATES
    })
    setBlogs(data.blogs);
  }, []);

  useEffect(() => {
    fectData();
  },[fectData])
  
  async function loadComment(blog_id){
    const { data } = await client.query({
      query: LOAD_COMMENT,
      variables: {blog_id}
    });

    let newblogs = blogs.map(blog => blog.id === blog_id ? {...blog, comments: data.comments} : {...blog});
    setBlogs(newblogs);
  }

  return (
    <div>
    {
      blogs.map(blog => (
        <div key={blog.id}>
          <h1>{blog.title}</h1>
          <p>{blog.description}</p>
          <button onClick={() => loadComment(blog.id)}>Load komen</button>
          {
            blog.comments
            ? <div>
                <ul>
                  {
                    blog.comments.map(comment => (
                      <li key={comment.id}>{comment.comment}</li>
                    ))
                  }
                </ul>
              </div>
            : null
          }
          
        </div>
      ))
    }
    </div>
  )
  
}

export default App;
