import { Bell, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Para Athlete Performance
            </h2>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">
            AI-powered insights for optimal performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative hover:bg-blue-50">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>

          <Button variant="ghost" size="icon" className="hover:bg-blue-50">
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>

          <Avatar className="ring-2 ring-blue-100">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
              CM
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
