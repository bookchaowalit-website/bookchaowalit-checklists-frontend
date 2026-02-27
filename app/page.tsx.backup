import Link from "next/link";
import { getAllChecklists } from "@/lib/mdx";

export default async function Home() {
  const checklists = await getAllChecklists();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Checklists
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Useful checklists for various tasks and projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklists.map((checklist) => (
            <Link
              key={checklist.slug}
              href={`/checklists/${checklist.slug}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {checklist.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {checklist.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                    {checklist.category}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(checklist.priority)}`}>
                    {checklist.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {checklist.items.length} items across {checklist.items.length} sections
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/checklists"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View All Checklists
          </Link>
        </div>
      </main>
    </div>
  );
}
