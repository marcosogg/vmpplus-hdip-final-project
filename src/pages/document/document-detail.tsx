import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getDocumentById, getDocumentUrl, deleteDocument } from '@/lib/api/documents';
import { Document } from '@/lib/api/documents';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Download, ArrowLeft, Trash2, FileText, Calendar, Info, Tag, FileType } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabase';

// Helper function for formatting file size (can be moved to utils later)
const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadDocument = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await getDocumentById(id);
        
        if (fetchError) {
          setError(fetchError.message);
          return;
        }
        
        setDocument(data);
      } catch (err) {
        console.error('Error loading document:', err);
        setError('An unexpected error occurred while loading the document');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocument();
  }, [id]);

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      const { data: url, error: downloadError } = await getDocumentUrl(document);
      
      if (downloadError) {
        toast({
          title: 'Download failed',
          description: downloadError.message,
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
      const { error: deleteError } = await deleteDocument(document.id);
      
      if (deleteError) {
        toast({
          title: 'Delete failed',
          description: deleteError.message,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
             <Button variant="ghost" onClick={() => navigate('/app/documents')} className="w-fit gap-2 p-0 hover:bg-transparent hover:text-primary">
               <ArrowLeft className="h-4 w-4" />
               <span>Back to Documents</span>
             </Button>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="text-red-500 text-center">
                <h2 className="text-lg font-semibold mb-2">Error Loading Document</h2>
                <p>{error || 'Document not found.'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/app/documents')} className="w-fit gap-2 p-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Documents</span>
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
            <Button variant="destructive" className="gap-2" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <FileText className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">{document.name}</h1>
                <p className="text-slate-300 text-sm">{document.description || 'No description provided'}</p>
                <Badge variant="secondary" className="mt-2 bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 capitalize">
                  {document.entity_type}
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-full">
                    <FileType className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Document Type</p>
                    <p className="font-medium">{document.file_type || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Uploaded</p>
                    <p className="font-medium">{new Date(document.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-full">
                    <Info className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">File Size</p>
                    <p className="font-medium">{formatFileSize(document.file_size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-full">
                    <Tag className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 capitalize">{document.entity_type} ID</p>
                    <p className="font-medium text-slate-700 break-all">{document.entity_id}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-10 flex flex-col items-center justify-center text-center gap-4">
                <div className="bg-slate-100 p-4 rounded-full">
                  <FileText className="h-10 w-10 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-700">Preview not available for this file type</h3>
                  <p className="text-slate-500 mt-1">Download the document to view its contents</p>
                </div>
                <Button className="mt-2 gap-2" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  <span>Download to View</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
} 