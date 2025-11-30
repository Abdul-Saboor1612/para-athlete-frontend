import { Button } from '@/components/ui/button';
import { Download, FileArchive } from 'lucide-react';
import { toast } from 'sonner';

export default function DownloadProject() {
  const handleDownload = () => {
    try {
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = '/downloads/para-athlete-monitoring-system.zip';
      link.download = 'para-athlete-monitoring-system.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started! Check your downloads folder.');
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download project. Please try again.');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleDownload}
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
      >
        <Download className="h-5 w-5" />
        Download Project
      </Button>
    </div>
  );
}