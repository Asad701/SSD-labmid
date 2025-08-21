'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-red-600 text-transparent bg-clip-text"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.h1>

        <motion.p
          className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          We are artisans of Damascus steel and master cutlers, dedicated to forging blades and crafts that blend ancient tradition with modern precision. Our work celebrates the strength, elegance, and history behind every layered fold and polished edge.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={i}
              className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-yellow-500/30 transition-all"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i, duration: 0.6 }}
            >
              <img
                src={`/${member.image}`}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full border-4 border-yellow-600"
              />
              <h3 className="text-xl mt-4 text-center font-semibold text-white">{member.name}</h3>
              <p className="text-yellow-400 text-center">{member.role}</p>
              <p className="text-sm text-gray-400 mt-2 text-center">{member.bio}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Link href="/" className="text-gray-400 hover:text-yellow-500 hover:shadow-yellow-400 hover:shadow-sm">Hand-forged with precision and passion 🛠️</Link>
        </motion.div>
      </div>
    </main>
  );
}

const team = [
  {
    name: 'Ustaad Bilal',
    role: 'Master Bladesmith',
    image: 'logo.png',
    bio: 'With over 30 years of experience, Bilal specializes in traditional Damascus folding techniques and ornamental blade detailing.',
  },
  {
    name: 'Ustaad Sufyan',
    role: 'Steel Finishing Expert',
    image: 'logo.png',
    bio: 'Responsible for etching, polishing, and quality finishing of each handcrafted piece to bring out its unique pattern.',
  },
  {
    name: 'Asad',
    role: 'Operations & Client Liaison',
    image: 'asad.png',
    bio: 'Manages client orders and ensures timely delivery of blades and crafts worldwide with attention to every detail.',
  },
];
