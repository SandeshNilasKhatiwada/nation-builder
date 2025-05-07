import React from "react";

const Home = () => {
  const handleLogin = () => {
    window.location.href = `https://${process.env.NEXT_PUBLIC_SLUG}.nationbuilder.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_NB_REDIRECT_URI}`;
  };

  return (
    <div>
      <h1>Welcome to NationBuilder OAuth with Next.js</h1>
      <p>Hello </p>
      <button onClick={handleLogin}>Login with NationBuilder</button>
    </div>
  );
};

export default Home;
