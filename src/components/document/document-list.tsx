import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDocumentsByEntity, getDocumentUrl, deleteDocument } from '@/lib/api/documents';
import { Document } from '@/lib/api/documents';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { FileIcon, TrashIcon, DownloadIcon, EyeIcon } from 'lucide-react';

interface DocumentListProps {
  entityType: 'vendor' | 'contract';
  entityId: string;
  onDocumentDeleted?: () => void;
  showUploadButton?: boolean;
  onUploadClick?: () => void;
}

export function DocumentList({ 
  entityType, 
  entityId,
  onDocumentDeleted,
  showUploadButton = false,
  onUploadClick
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const { toast } = useToast();

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getDocumentsByEntity(entityType, entityId);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      setDocuments(data || []);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('An unexpected error occurred while loading documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [entityType, entityId]);

  const handleDownload = async (document: Document) => {
    setError(null);
    try {
      const { data: url, error: downloadError } = await getDocumentUrl(document);
      
      if (downloadError) {
        const errorMessage = `Download failed: ${downloadError.message}`;
        setError(errorMessage);
        toast({
          title: 'Download failed',
          description: errorMessage,
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
      const errorMessage = 'An unexpected error occurred during download';
      setError(errorMessage);
      toast({
        title: 'Download failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    setError(null);
    
    try {
      const { error: deleteError } = await deleteDocument(documentToDelete.id);
      
      if (deleteError) {
        const errorMessage = `Delete failed: ${deleteError.message}`;
        setError(errorMessage);
        toast({
          title: 'Delete failed',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Document deleted',
        description: 'The document has been deleted successfully',
      });
      
      // Refresh the document list
      loadDocuments();
      
      // Call callback if provided
      if (onDocumentDeleted) {
        onDocumentDeleted();
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      const errorMessage = 'An unexpected error occurred during deletion';
      setError(errorMessage);
      toast({
        title: 'Delete failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  const getFileIcon = (fileType: string | null) => {
    return <FileIcon className="h-4 w-4" />;
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
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 py-2">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents</CardTitle>
        {showUploadButton && (
          <Button onClick={onUploadClick}>Upload Document</Button>
        )}
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No documents found. Upload a document to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getFileIcon(doc.file_type)}
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>{doc.file_type || 'Unknown'}</TableCell>
                  <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                  <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDownload(doc)}
                        title="Download"
                      >
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setDocumentToDelete(doc)}
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={documentToDelete !== null} 
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document "{documentToDelete?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
} 