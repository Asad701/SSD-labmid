'use client';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <main className="montserrat-font min-h-screen bg-black text-white px-6 py-10 mt-2">
      <div className="montserrat-font max-w-5xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-red-600 text-transparent bg-clip-text py-5"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Privacy Policy
        </motion.h1>

        <motion.p
          className="text-lg text-center max-w-3xl mx-auto mb-12 text-whiet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          This Privacy Policy describes how we handle your information when you purchase our chef sets, kitchen knives, and Damascus steel products.
        </motion.p>

        <div className="space-y-10 text-base leading-relaxed text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-2">1. Information We Collect</h2>
            <p>We collect only necessary details such as your name, contact info, and address to process your orders. No credit card data is stored on our servers.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-2">2. How We Use Data</h2>
            <p>Your data is used to fulfill orders, improve service, and notify you about new products like exclusive knife sets or offers. You may unsubscribe anytime.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-2">3. Security</h2>
            <p>We take data security seriously. Your information is encrypted and protected against unauthorized access at all times.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-2">4. Cookies</h2>
            <p>We use basic cookies to keep your cart intact and improve your shopping experience. You may disable them in your browser settings.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-2">5. Contact</h2>
            <p>For questions or data deletion requests, reach out to us at <span className="text-yellow-500">royalfoldforge@gmail.com</span>.</p>
          </motion.div>
        </div>

        <motion.p
          className="mt-16 text-center text-white text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          🔐 Your trust is our honor. Forged with privacy, delivered with care.
        </motion.p>
      </div>
    </main>
  );
}
