"use client";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-geistSans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {session 
          ? (
            <div>
              <p>Welcome {session.user?.name}. Signed In As</p>
              <p>{session.user?.email}</p>
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          ) 
          : (
            <div>
              <h1 className="font-geistMono">Connect to spotify</h1>
              <button onClick={() => signIn('spotify')}>Sign in with spotify</button>
            </div>
          )}
      </main>
    </div>
  );
}
