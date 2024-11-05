import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

export default function Page() {
  // biome-ignore lint/suspicious/useAwait: server action must be async
  async function setSession() {
    'use server'
    cookies().set('auth_session', 'authenticated', {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    })
    redirect('/')
  }
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>L2BEAT</CardTitle>
          <CardDescription>Token Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={setSession}>
            <Button className="w-full">Sign in with Google</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
