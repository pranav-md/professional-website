import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

const RSS_URL = 'https://medium.com/feed/@pranavmadev'
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`

function SkeletonPost() {
  return (
    <div className="py-6 border-b border-rule">
      <div className="skeleton h-5 w-3/4 mb-3" />
      <div className="skeleton h-3 w-24" />
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Writing() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === 'ok') {
          setPosts(data.items.slice(0, 6))
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="writing" className="snap-section">
      {/* Sticky header */}
      <div className="section-header-sticky px-4 md:px-20 lg:px-32 pt-8 md:pt-10">
        <SectionHeader num="04" title="Writing" />
      </div>

      {/* Scrollable posts */}
      <div className="section-scroll px-4 md:px-20 lg:px-32 pb-16">
        <div className="max-w-2xl">
          {loading && (
            <div>{[...Array(4)].map((_, i) => <SkeletonPost key={i} />)}</div>
          )}

          {error && (
            <p className="font-mono text-muted text-sm">
              Could not load posts.{' '}
              <a
                href="https://medium.com/@pranavmadev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4"
              >
                Read on Medium →
              </a>
            </p>
          )}

          {!loading && !error && (
            <div>
              {posts.map((post, i) => (
                <motion.a
                  key={post.guid}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between py-5 md:py-6 border-b border-rule hover:border-accent transition-colors duration-300 no-underline"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className="flex-1 pr-6">
                    <h3
                      className="font-display text-primary group-hover:text-accent transition-colors duration-200 leading-snug mb-2"
                      style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}
                    >
                      {post.title}
                    </h3>
                    <span className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>
                      {formatDate(post.pubDate)}
                    </span>
                  </div>
                  <span
                    className="font-mono text-muted group-hover:text-accent transition-colors duration-200 shrink-0 mt-1"
                    style={{ fontSize: '1.1rem' }}
                  >
                    →
                  </span>
                </motion.a>
              ))}
            </div>
          )}

          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a
              href="https://medium.com/@pranavmadev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-muted hover:text-accent transition-colors duration-200 underline underline-offset-4"
              style={{ fontSize: '0.8rem' }}
            >
              All posts on Medium →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
