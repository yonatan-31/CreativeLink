import MessageList from '@/components/MessageList';
import Link from 'next/link';

export default function DashboardMessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Messages</h1>
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">Back to dashboard</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-medium mb-3">Conversations Specific to your Projects</h2>
              <MessageList />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">Select a conversation to open the chat.</div>
          </div>
        </div>
      </main>
    </div>
  );
}
