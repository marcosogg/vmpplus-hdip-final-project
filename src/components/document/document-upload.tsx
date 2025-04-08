import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadDocument } from '@/lib/api/documents';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  entityType: 'vendor' | 'contract';
  entityId: string;
  onSuccess?: () => void;
}

export function DocumentUpload({ entityType, entityId, onSuccess }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Use file name as document name by default
      if (!docName) {
        setDocName(selectedFile.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      const errorMessage = 'Please select a file to upload';
      setError(errorMessage);
      toast({
        title: 'No file selected',
        description: errorMessage,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      const { data, error: uploadError } = await uploadDocument(
        file,
        entityType,
        entityId,
        docName || file.name
      );
      
      if (uploadError) {
        const errorMessage = `Upload failed: ${uploadError.message}`;
        setError(errorMessage);
        toast({
          title: 'Upload failed',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Document uploaded',
        description: 'Your document has been uploaded successfully',
      });
      
      // Reset form
      setFile(null);
      setDocName('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      const errorMessage = 'An unexpected error occurred while uploading the document';
      setError(errorMessage);
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded" role="alert">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="docName">Document Name</Label>
        <Input
          id="docName"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          placeholder="Enter document name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        {file && (
          <div className="text-sm text-gray-500">
            Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
          </div>
        )}
      </div>
      
      <Button type="submit" disabled={!file || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </form>
  );
} 