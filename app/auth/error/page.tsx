'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
                <p className="text-gray-600 mb-6">
                    {error === 'AccessDenied'
                        ? 'Your email address is not authorized to access this dashboard. Please contact the administrator.'
                        : 'An error occurred during sign in. Please try again.'}
                </p>
                <Link
                    href="/auth/signin"
                    className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center font-medium"
                >
                    Try Again
                </Link>
            </div>
        </div>
    )
}

export default function AuthError() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthErrorContent />
        </Suspense>
    )
}
