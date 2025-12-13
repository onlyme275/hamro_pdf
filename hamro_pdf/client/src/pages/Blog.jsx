"use client";
import { CalendarDays, User, ArrowRight } from "lucide-react";

export default function Blog() {
  const posts = [
    {
      title: "5 Tips to Make Your PDFs Look Professional",
      description:
        "Learn how to design and export your PDF documents with a clean, branded, and professional appearance using simple tools.",
      author: "Sanjay Adhikari",
      date: "Oct 10, 2025",
      tag: "Design",
      image:
        "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=60",
    },
    {
      title: "Why Cloud PDF Editors Are Changing the Game",
      description:
        "Cloud-based PDF tools are making document management easier and faster. Here's why they matter for modern professionals.",
      author: "Aarati Lama",
      date: "Oct 3, 2025",
      tag: "Technology",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60",
    },
    {
      title: "Secure Document Sharing with HAMROpdf",
      description:
        "Discover how HAMROpdf ensures your documents remain safe and private with advanced encryption and access control.",
      author: "Bishal KC",
      date: "Sep 28, 2025",
      tag: "Security",
      image:
        "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?auto=format&fit=crop&w=800&q=60",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 dark:from-slate-900 dark:to-blue-950 text-slate-800 dark:text-slate-100">
      {/* Header Section */}
      <section className="text-center py-20 px-6 md:px-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Our <span className="text-blue-600">Blog</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
          Insights, tutorials, and updates from the HAMROpdf team. Stay informed and
          inspired with our latest articles.
        </p>
      </section>

      {/* Blog Grid */}
      <section className="px-6 md:px-16 pb-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {posts.map((post, index) => (
          <article
            key={index}
            className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 flex flex-col justify-between h-full">
              <div>
                <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs px-3 py-1 rounded-full mb-3">
                  {post.tag}
                </span>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                  {post.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                  <CalendarDays className="w-4 h-4 ml-4" />
                  <span>{post.date}</span>
                </div>
              </div>
              <button className="mt-5 flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline group">
                Read More
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-blue-600 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Want to Share Your Story?
        </h2>
        <p className="max-w-2xl mx-auto mb-6">
          Join our blog community and contribute articles about design, workflow,
          productivity, or your experiences using HAMROpdf.
        </p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-slate-100 transition">
          Become a Contributor
        </button>
      </section>
    </main>
  );
}
