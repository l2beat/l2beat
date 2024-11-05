import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { AuthErrorMessages } from '~/lib/auth-errors'
import { getSession } from '~/server/auth/cookie'

export default async function Page({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  if (await getSession()) {
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
          <Link href="/api/auth" prefetch={false}>
            <Button className="w-full">Sign in with L2BEAT</Button>
          </Link>
        </CardContent>
        {searchParams.error && (
          <CardFooter>
            <p className="text-red-500">
              Error:{' '}
              {AuthErrorMessages[searchParams.error] ??
                'An unknown error occurred.'}
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
