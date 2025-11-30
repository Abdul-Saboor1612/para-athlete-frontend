export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-gray-700">
              Para Athlete Performance System
            </p>
            <p className="text-xs text-gray-500 mt-1">
              AI-Powered Performance Analysis & Coaching
            </p>
          </div>

          <div className="text-xs text-gray-500">
            <p>© 2025 Para Athlete Performance System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
