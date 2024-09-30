import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js"

export async function GET(request, {params}) {
  const session = await getServerSession(authOptions);
  const searchParams = request.nextUrl.search

  if(session) {
    const response = await fetch(`${process.env.SPOTIFY_API_URL}/me/top/${params.type+searchParams}`, {
      headers: {
        'Authorization' : `Bearer ${session.accessToken}`
      }
    });
    const data = await response.json()
    return Response.json(await data)
  } else {
    return Response.json('you must be logged in')
  }
}