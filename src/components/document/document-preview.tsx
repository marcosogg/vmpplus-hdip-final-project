import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDocumentById, getDocumentUrl } from '@/lib/api/documents';
import { Document } from '@/lib/api/documents';
import { useToast } from '@/components/ui/use-toast';
import { DownloadIcon, FileIcon, CalendarIcon, UserIcon } from 'lucide-react';

interface DocumentPreviewProps {
  documentId: string;
}

export function DocumentPreview({ documentId }: DocumentPreviewProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadDocument = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getDocumentById(documentId);
        
        if (error) {
          setError(error.message);
          return;
        }
        
        setDocument(data);
        
        // If it's an image, load the preview URL
        if (data && data.file_type?.startsWith('image/')) {
          const { data: url, error: urlError } = await getDocumentUrl(data);
          
          if (urlError) {
            console.error('Error getting preview URL:', urlError);
          } else if (url) {
            setPreviewUrl(url);
          }
        }
      } catch (err) {
        console.error('Error loading document:', err);
        setError('An unexpected error occurred while loading the document');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocument();
  }, [documentId]);

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      const { data: url, error } = await getDocumentUrl(document);
      
      if (error) {
        toast({
          title: 'Download failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      if (url) {
        // Open the URL in a new tab
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error('Error downloading document:', err);
      toast({
        title: 'Download failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="text-red-500 py-2">{error}</div>
        </CardContent>
      </Card>
    );
  }

  // Not found state
  if (!document) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Document not found.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate if we can generate a preview (e.g., images, PDFs)
  const canPreview = document.file_type?.startsWith('image/') && previewUrl !== null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileIcon className="h-5 w-5" />
              {document.name}
            </CardTitle>
            <CardDescription className="mt-1">{document.description || 'No description'}</CardDescription>
          </div>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <DownloadIcon className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Document Type</h3>
            <p>{document.file_type || 'Unknown'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">File Size</h3>
            <p>{formatFileSize(document.file_size)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Uploaded</h3>
            <p className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {new Date(document.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Related To</h3>
            <p>{document.entity_type.charAt(0).toUpperCase() + document.entity_type.slice(1)} ID: {document.entity_id}</p>
          </div>
        </div>
        
        {/* Preview area */}
        {canPreview ? (
          <div className="mt-4 border rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">Preview</h3>
            <div className="flex justify-center">
              {document.file_type?.startsWith('image/') && previewUrl && (
                <img 
                  src={previewUrl} 
                  alt={document.name} 
                  className="max-w-full max-h-[500px] object-contain"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 border rounded-md p-8 text-center bg-gray-50">
            <p className="text-gray-500">Preview not available for this file type.</p>
            <Button onClick={handleDownload} variant="outline" className="mt-4">
              Download to View
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 