import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 text-primary">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_543)">
                    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"></path>
                  </g>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">BBA 6TH SEM NOTES</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              Your central hub for accessing and sharing classroom notes. Collaborate with classmates and never miss important study materials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="mailto:contact@bishalkhadka.info.np" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">
                  Email Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} BBA 6TH SEM NOTES. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}