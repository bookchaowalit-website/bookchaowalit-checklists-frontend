import { notFound } from "next/navigation";
import Link from "next/link";
import { getChecklistBySlug } from "@/lib/mdx";
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const { getAllChecklists } = await import('@/lib/mdx');
  const checklists = await getAllChecklists();
  return checklists.map((checklist) => ({
    slug: checklist.slug,
  }));
}

export default async function ChecklistPage({ params }: PageProps) {
  const checklist = await getChecklistBySlug(params.slug);

  if (!checklist) {
    notFound();
  }

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
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/checklists"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back to Checklists
          </Link>
        </div>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {checklist.title}
                </h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(checklist.priority)}`}>
                  {checklist.priority}
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {checklist.description}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                  {checklist.category}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {checklist.items.length} items
                </span>
              </div>
            </div>
          </header>

          <div className="space-y-8">
            {checklist.items.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {section[0]}
                </h3>
                <ul className="space-y-2">
                  {section.slice(1).map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created on: {new Date(checklist.created_at).toLocaleDateString()}
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}