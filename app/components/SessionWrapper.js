"use client";
import { SessionProvider } from "next-auth/react"

import React from 'react'

//Prevents the whole app from being client side
//See: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props
const SessionWrapper = ({children}) => {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}

export default SessionWrapper