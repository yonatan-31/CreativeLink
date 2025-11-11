import MessageList from '@/components/MessageList';

export default function DashboardMessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-medium mb-3">Messages</h2>
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
