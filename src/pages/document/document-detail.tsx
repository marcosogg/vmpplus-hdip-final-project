import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { getDocumentById, getDocumentUrl, deleteDocument } from '@/lib/api/documents';
import { Document } from '@/lib/api/documents';
import { DocumentPreview } from '@/components/document/document-preview';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DownloadIcon, ArrowLeftIcon, TrashIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [entityName, setEntityName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadDocument = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getDocumentById(id);
        
        if (error) {
          setError(error.message);
          return;
        }
        
        setDocument(data);
        
        // Load the related entity name
        if (data) {
          await loadEntityName(data);
        }
      } catch (err) {
        console.error('Error loading document:', err);
        setError('An unexpected error occurred while loading the document');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocument();
  }, [id]);

  const loadEntityName = async (doc: Document) => {
    try {
      if (doc.entity_type === 'vendor') {
        const { data, error } = await supabase
          .from('vendors')
          .select('name')
          .eq('id', doc.entity_id)
          .single();
          
        if (error) throw error;
        if (data) setEntityName(data.name);
      } else if (doc.entity_type === 'contract') {
        const { data, error } = await supabase
          .from('contracts')
          .select('title')
          .eq('id', doc.entity_id)
          .single();
          
        if (error) throw error;
        if (data) setEntityName(data.title);
      }
    } catch (err) {
      console.error('Error loading entity name:', err);
    }
  };

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

  const handleDelete = async () => {
    if (!document) return;
    
    try {
      const { error } = await deleteDocument(document.id);
      
      if (error) {
        toast({
          title: 'Delete failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Document deleted',
        description: 'The document has been deleted successfully',
      });
      
      // Navigate back to document list
      navigate('/app/documents');
    } catch (err) {
      console.error('Error deleting document:', err);
      toast({
        title: 'Delete failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleGoToEntity = () => {
    if (!document) return;
    
    if (document.entity_type === 'vendor') {
      navigate(`/app/vendors/${document.entity_id}`);
    } else if (document.entity_type === 'contract') {
      navigate(`/app/contracts/${document.entity_id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader 
          title="Document Details" 
          description="Loading document information..."
        />
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="space-y-4">
        <PageHeader 
          title="Document Details" 
          description="View document information"
          actions={
            <Button onClick={() => navigate('/app/documents')} variant="outline">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Documents
            </Button>
          }
        />
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-red-500">
            {error || 'Document not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader 
        title={document.name}
        description={
          <>
            Document attached to {document.entity_type}{' '}
            <button 
              onClick={handleGoToEntity}
              className="text-blue-600 hover:underline font-medium"
            >
              {entityName || document.entity_id}
            </button>
          </>
        }
        actions={
          <div className="flex space-x-2">
            <Button onClick={() => navigate('/app/documents')} variant="outline">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Documents
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => setShowDeleteDialog(true)} variant="destructive">
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      />
      
      <DocumentPreview documentId={document.id} />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document "{document.name}".
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
    </div>
  );
} 