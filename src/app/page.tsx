"use client";
import Image from "next/image";

export default function Home() {
  const handleLogin = () => {
    window.location.href = `https://${process.env.NEXT_PUBLIC_SLUG}.nationbuilder.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_CALLBACKS}`;
  };
  return (
    <div>
      <div>
        <h1>Welcome to NationBuilder OAuth with Next.js</h1>
        <p>Hello {process.env.NEXT_PUBLIC_SLUG}</p>
        <button onClick={handleLogin}>Login with NationBuilder</button>
      </div>
    </div>
  );
}
