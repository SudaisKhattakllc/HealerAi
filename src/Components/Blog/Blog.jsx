import React from 'react'
import { motion as Motion } from 'framer-motion'
import image1 from "../../assets/pexels-alex-green-5699431.jpg"
import image2 from "../../assets/pexels-cdc-library-3992931.jpg"
import image3 from "../../assets/pexels-cottonbro-7578803.jpg"
import image4 from "../../assets/pexels-fr3nks-305568.jpg"
import image5 from "../../assets/pexels-kampus-7551652.jpg"
import image6 from "../../assets/pexels-karola-g-7195310.jpg"
import image7 from "../../assets/pexels-khanh-hoang-minh-2-77752098-34717769.jpg"
import image8 from "../../assets/pexels-mart-production-7230386.jpg"
import image9 from "../../assets/pexels-pixabay-40568.jpg"
import image10 from "../../assets/pexels-pixabay-52527.jpg"
import image11 from "../../assets/pexels-polina-tankilevitch-5234582.jpg"
import image12 from "../../assets/pexels-tima-miroshnichenko-5355730.jpg"
import { IconMail } from '@tabler/icons-react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

function PostCard({ post }) {
  return (


<>


    <Motion.article variants={card} className="group rounded-2xl overflow-hidden shadow-lg bg-white">
      <div className="relative h-48 md:h-56 lg:h-44 overflow-hidden">
        <img loading="lazy" decoding="async" src={post.image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 left-4 bg-sky-400/90 text-white text-xs font-semibold px-3 py-1 rounded-full">{post.tag}</div>
      </div>

      <div className="p-4 md:p-5">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-2">{post.title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{post.excerpt}</p>
      </div>
    </Motion.article>
</>
  )
}

export default function Blog() {
  const latest = [
    { id: 1, image: image1, title: 'How Preventive Care Elevates Patient Outcomes', excerpt: 'Simple tests and early detection can change lives. Learn practical steps clinics can adopt today.', author: 'Dr. A. Khan', date: 'Nov 10, 2025', read: 4, tag: 'Wellness' },
    { id: 2, image: image2, title: 'Mental Health Awareness in Primary Care', excerpt: 'Integrating mental health screenings into routine exams improves long-term outcomes.', author: 'Dr. S. Lee', date: 'Nov 8, 2025', read: 5, tag: 'Mental Health' },
    { id: 3, image: image3, title: 'Telemedicine Best Practices for Clinics', excerpt: 'A practical guide to delivering secure, effective virtual consultations.', author: 'Dr. M. Patel', date: 'Nov 5, 2025', read: 6, tag: 'Telemedicine' },
    { id: 4, image: image4, title: 'Nutrition Counseling that Works', excerpt: 'Evidence-based tips to help patients adopt healthier eating habits.', author: 'Dr. R. Gomez', date: 'Nov 3, 2025', read: 3, tag: 'Nutrition' },
    { id: 5, image: image5, title: 'Managing Chronic Conditions with Technology', excerpt: 'How remote monitoring helps patients stay on track between visits.', author: 'Dr. L. Chen', date: 'Oct 30, 2025', read: 7, tag: 'Chronic Care' },
    { id: 6, image: image6, title: 'Patient Experience: Small Changes, Big Impact', excerpt: 'Design tweaks and workflow changes that dramatically improve satisfaction.', author: 'Dr. N. Singh', date: 'Oct 28, 2025', read: 4, tag: 'Experience' }
  ]

  const articles = [
    { id: 7, image: image7, title: 'Data Security Essentials for Clinics', excerpt: 'Protect patient records with these practical steps.', author: 'Dr. H. Brown', date: 'Oct 25, 2025', read: 5, tag: 'Security' },
    { id: 8, image: image8, title: 'AI in Diagnostics: Opportunities & Limits', excerpt: 'Where AI helps most — and where human oversight remains critical.', author: 'Dr. K. Osei', date: 'Oct 20, 2025', read: 8, tag: 'AI' },
    { id: 9, image: image9, title: 'Community Health Programs that Scale', excerpt: 'Strategies for meaningful community outreach and engagement.', author: 'Dr. P. Rivera', date: 'Oct 15, 2025', read: 6, tag: 'Community' },
    { id: 10, image: image10, title: 'Clinical Trials: How Practices Can Participate', excerpt: 'Benefits for patients and clinics by joining research networks.', author: 'Dr. J. Miller', date: 'Oct 10, 2025', read: 9, tag: 'Research' },
    { id: 11, image: image11, title: 'Rapid Diagnostics for Infectious Diseases', excerpt: 'Implementing fast, reliable tests for better infection control.', author: 'Dr. E. Rossi', date: 'Oct 6, 2025', read: 5, tag: 'Diagnostics' },
    { id: 12, image: image12, title: 'Sustainable Healthcare Practices', excerpt: 'Reduce waste and costs while improving your clinic footprint.', author: 'Dr. A. Silva', date: 'Oct 1, 2025', read: 4, tag: 'Sustainability' }
  ]

  return (
    <>
    <Navbar/>
    <div className="py-16 px-6 md:px-12 lg:px-20 bg-sky-50">
      {/* Hero / Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Insights & Stories</h1>
            <p className="text-gray-600 mt-2">Latest stories, research and practical tips for healthcare teams.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column: Latest Stories & Articles */}
        <div className="lg:col-span-2 space-y-12">
          {/* Latest Stories */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Latest Stories</h2>
              <div className="text-sm text-sky-400">6 posts</div>
            </div>

            <Motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map(p => <PostCard key={p.id} post={p} />)}
            </Motion.div>
          </section>

          {/* Articles */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Articles</h2>
              <div className="text-sm text-sky-400">In-depth reads</div>
            </div>

            <Motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(p => <PostCard key={p.id} post={p} />)}
            </Motion.div>
          </section>
        </div>

        {/* Sidebar: Featured + Newsletter */}
        <aside className="space-y-6">
          <div className="rounded-2xl p-6 bg-white shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-gray-800">Featured</h3>
            <p className="text-sm text-gray-600 mt-2">Don’t miss our editor’s pick: 'AI in Diagnostics'.</p>
            <div className="mt-4">
              <img loading="lazy" decoding="async" src={image8} alt="featured" className="w-full h-40 object-cover rounded-lg" />
            </div>
          </div>

          {/* Popular Posts widget (small, below Featured) */}
          <div className="rounded-2xl p-4 bg-white shadow-sm border border-sky-100">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Popular Posts</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <img loading="lazy" decoding="async" src={image1} alt="pop1" className="w-14 h-10 object-cover rounded-md" />
                <div>
                  <div className="text-xs font-semibold text-gray-800">How Preventive Care Elevates Patient Outcomes</div>
                  <div className="text-xs text-sky-400">Wellness</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <img loading="lazy" decoding="async" src={image2} alt="pop2" className="w-14 h-10 object-cover rounded-md" />
                <div>
                  <div className="text-xs font-semibold text-gray-800">Mental Health Awareness in Primary Care</div>
                  <div className="text-xs text-sky-400">Mental Health</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <img loading="lazy" decoding="async" src={image3} alt="pop3" className="w-14 h-10 object-cover rounded-md" />
                <div>
                  <div className="text-xs font-semibold text-gray-800">Telemedicine Best Practices for Clinics</div>
                  <div className="text-xs text-sky-400">Telemedicine</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl p-6 bg-white shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-gray-800">Subscribe</h3>
            <p className="text-sm text-gray-600 mt-2">Get new articles delivered weekly.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input placeholder="Email address" className="w-full sm:flex-1 px-3 py-2 rounded-lg border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              <button className="w-full sm:w-auto bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-lg transition-colors"><IconMail size={18} /></button>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-white shadow-sm border border-sky-100 text-sm text-gray-600">
            <div className="font-semibold text-gray-800 mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-3 py-1 rounded-full border border-sky-200 text-sky-400">Telemedicine</span>
              <span className="text-xs px-3 py-1 rounded-full border border-sky-200 text-sky-400">AI</span>
              <span className="text-xs px-3 py-1 rounded-full border border-sky-200 text-sky-400">Nutrition</span>
              <span className="text-xs px-3 py-1 rounded-full border border-sky-200 text-sky-400">Security</span>
            </div>
          </div>

          {/* Premium Tall Card - Sidebar Spotlight */}
          <div className="rounded-2xl overflow-hidden relative group">
            <div className="relative h-64 overflow-hidden">
              <img loading="lazy" decoding="async" src={image11} alt="spotlight" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-600" />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/70 via-transparent to-transparent"></div>
            </div>

            <div className="p-5 md:p-6 relative z-10 bg-gradient-to-t from-transparent to-black/20">
              <span className="inline-block text-xs font-semibold text-white bg-sky-900/20 px-2 py-1 rounded">Spotlight</span>
              <h4 className="mt-3 text-lg font-bold text-sky-400">Clinic Spotlight: Reducing Readmissions by 30%</h4>
              <p className="mt-2 text-sm text-sky-400">A case study on improving follow-up care and patient education to reduce hospital readmissions.</p>
              <div className="mt-4">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-sky-400 rounded-lg font-semibold shadow-sm hover:shadow-md transition">Read Story</button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer CTA removed per request */}
    </div>

    <Footer/>
</>
  )
}