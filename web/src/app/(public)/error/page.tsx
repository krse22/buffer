'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const description = searchParams.get('description');

  return (
    <main className="text-center max-w-md px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Something went wrong
      </h1>
      {reason && (
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Error:</span> {reason}
        </p>
      )}
      {description && (
        <p className="text-gray-500 text-sm mb-6">{description}</p>
      )}
      <Link
        href="/login"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Back to Login
      </Link>
    </main>
  );
}

export default function ErrorPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
