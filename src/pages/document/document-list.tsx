import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileIcon, TrashIcon, DownloadIcon, PlusIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { Document, getDocumentUrl, deleteDocument } from '@/lib/api/documents';
import { supabase } from '@/lib/supabase';
import { DocumentUpload } from '@/components/document/document-upload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Extended document type with vendor details
interface DocumentWithVendor extends Document {
  vendor_details?: {
    name: string;
    logo_url: string | null;
  };
}

export function DocumentListPage() {
  const [documents, setDocuments] = useState<DocumentWithVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<'all' | 'vendor' | 'contract'>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadEntityType, setUploadEntityType] = useState<'vendor' | 'contract'>('vendor');
  const [uploadEntityId, setUploadEntityId] = useState('');
  const [vendors, setVendors] = useState<{ id: string; name: string }[]>([]);
  const [contracts, setContracts] = useState<{ id: string; title: string }[]>([]);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Step A: Get all documents from all entities
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      const documentsData = data as DocumentWithVendor[];
      
      // Step B: Identify unique vendor IDs
      const vendorIds = documentsData
        .filter(doc => doc.entity_type === 'vendor')
        .map(doc => doc.entity_id)
        .filter((id, index, self) => self.indexOf(id) === index); // Get unique IDs
      
      // Step C: If there are vendor IDs, fetch vendor details
      if (vendorIds.length > 0) {
        const { data: vendorData, error: vendorError } = await supabase
          .from('vendors')
          .select('id, name, logo_url')
          .in('id', vendorIds);
          
        if (vendorError) throw vendorError;
        
        // Step D: Combine document data with vendor details
        const documentsWithVendors = documentsData.map(doc => {
          if (doc.entity_type === 'vendor') {
            const vendor = vendorData?.find(v => v.id === doc.entity_id);
            if (vendor) {
              return {
                ...doc,
                vendor_details: {
                  name: vendor.name,
                  logo_url: vendor.logo_url
                }
              };
            }
          }
          return doc;
        });
        
        setDocuments(documentsWithVendors);
      } else {
        setDocuments(documentsData);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('An unexpected error occurred while loading documents');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEntities = async () => {
    try {
      // Load vendors for the dropdown
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('id, name')
        .order('name');
        
      if (vendorError) throw vendorError;
      setVendors(vendorData || []);
      
      // Load contracts for the dropdown
      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .select('id, title')
        .order('title');
        
      if (contractError) throw contractError;
      setContracts(contractData || []);
    } catch (err) {
      console.error('Error loading entities:', err);
      toast({
        title: 'Error',
        description: 'Failed to load vendors and contracts',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadDocuments();
    loadEntities();
  }, []);

  const handleDownload = async (document: Document) => {
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

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      const { error } = await deleteDocument(documentToDelete.id);
      
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
      
      // Refresh the document list
      loadDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      toast({
        title: 'Delete failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadDialog(false);
    loadDocuments();
    toast({
      title: 'Document uploaded',
      description: 'Your document has been uploaded successfully',
    });
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

  const getEntityName = (document: DocumentWithVendor) => {
    if (document.entity_type === 'vendor') {
      if (document.vendor_details) {
        return document.vendor_details.name;
      }
      const vendor = vendors.find(v => v.id === document.entity_id);
      return vendor ? vendor.name : document.entity_id;
    } else if (document.entity_type === 'contract') {
      const contract = contracts.find(c => c.id === document.entity_id);
      return contract ? contract.title : document.entity_id;
    }
    return document.entity_id;
  };

  // Filter documents based on search query and entity type
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
    const matchesFilter = 
      entityFilter === 'all' || 
      doc.entity_type === entityFilter;
      
    return matchesSearch && matchesFilter;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader 
          title="Documents" 
          description="Manage all documents in the system"
        />
        <Card>
          <CardContent className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader 
          title="Documents" 
          description="Manage all documents in the system"
        />
        <Card>
          <CardContent>
            <div className="text-red-500 py-2">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Documents" 
        description="Manage all documents in the system"
        actions={
          <Button onClick={() => setShowUploadDialog(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        }
      />
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entity-filter">Entity Type</Label>
              <Select 
                value={entityFilter} 
                onValueChange={(value) => setEntityFilter(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="vendor">Vendors Only</SelectItem>
                  <SelectItem value="contract">Contracts Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Document list */}
      <Card>
        <CardContent className="p-0">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No documents found. Upload a document to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} onClick={() => navigate(`/app/documents/${doc.id}`)} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.file_type)}
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {doc.entity_type === 'vendor' && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage 
                              src={doc.vendor_details?.logo_url || `https://logo.clearbit.com/${getEntityName(doc).toLowerCase().replace(/\s+/g, '')}.com`} 
                              alt={getEntityName(doc)} 
                            />
                            <AvatarFallback>{getEntityName(doc).substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{getEntityName(doc)}</span>
                        </div>
                      )}
                      {doc.entity_type === 'contract' && (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">C</span>
                          </div>
                          <span>{getEntityName(doc)}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                    <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(doc);
                          }}
                          title="Download"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDocumentToDelete(doc);
                          }}
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
      </Card>
      
      {/* Upload Document Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document and associate it with a vendor or contract.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="entity-type">Entity Type</Label>
              <Select 
                value={uploadEntityType} 
                onValueChange={(value) => setUploadEntityType(value as 'vendor' | 'contract')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entity-id">
                {uploadEntityType === 'vendor' ? 'Vendor' : 'Contract'}
              </Label>
              <Select 
                value={uploadEntityId} 
                onValueChange={setUploadEntityId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${uploadEntityType}`} />
                </SelectTrigger>
                <SelectContent>
                  {uploadEntityType === 'vendor' ? (
                    vendors.map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))
                  ) : (
                    contracts.map(contract => (
                      <SelectItem key={contract.id} value={contract.id}>
                        {contract.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {uploadEntityId && (
              <DocumentUpload 
                entityType={uploadEntityType}
                entityId={uploadEntityId}
                onSuccess={handleUploadSuccess}
              />
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 