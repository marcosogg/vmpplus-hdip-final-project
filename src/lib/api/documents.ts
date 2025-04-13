import { supabase } from '@/lib/supabase';
import { handleApiError } from './api-utils';
import { ApiResponse } from '@/types/api';
import { Database } from '@/types/supabase';
import { ActivityType, logDocumentActivity } from './activity';

export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];

// Helper to generate a unique file path
const generateFilePath = (entityType: string, entityId: string, fileName: string): string => {
  const extension = fileName.split('.').pop();
  const timestamp = new Date().getTime();
  return `${entityType}/${entityId}/${timestamp}-${fileName}`;
};

// Upload a document
export async function uploadDocument(
  file: File,
  entityType: 'vendor' | 'contract',
  entityId: string,
  name?: string
): Promise<ApiResponse<Document>> {
  // 1. Upload the file to storage
  const filePath = generateFilePath(entityType, entityId, file.name);
  
  return handleApiError(async () => {
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    
    // 2. Insert record in documents table
    const { data, error } = await supabase
      .from('documents')
      .insert({
        name: name || file.name,
        entity_type: entityType,
        entity_id: entityId,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: userData.user?.id
      })
      .select()
      .single();
      
    if (error) throw error;

    // Log the activity
    await logDocumentActivity(
      ActivityType.DOCUMENT_UPLOADED,
      data.id,
      `New document uploaded: ${data.name}`,
      {
        entity_type: entityType,
        entity_id: entityId,
        file_type: file.type,
        file_size: file.size
      }
    );

    return data as Document;
  });
}

// Get documents for an entity
export async function getDocumentsByEntity(
  entityType: 'vendor' | 'contract',
  entityId: string
): Promise<ApiResponse<Document[]>> {
  return handleApiError(
    supabase
      .from('documents')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Document[];
      })
  );
}

// Get document by ID
export async function getDocumentById(id: string): Promise<ApiResponse<Document>> {
  return handleApiError(
    supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Document;
      })
  );
}

// Get document download URL
export async function getDocumentUrl(document: Document): Promise<ApiResponse<string>> {
  return handleApiError(
    supabase.storage
      .from('documents')
      .createSignedUrl(document.file_path, 60)
      .then(({ data, error }) => {
        if (error) throw error;
        if (!data?.signedUrl) throw new Error('Failed to generate download URL');
        return data.signedUrl;
      })
  );
}

// Delete a document
export async function deleteDocument(id: string): Promise<ApiResponse<null>> {
  return handleApiError(async () => {
    // First get the document to find its file path
    const { data: document, error: getError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
      
    if (getError) throw getError;
    if (!document) throw new Error('Document not found');
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path]);
      
    if (storageError) throw storageError;
    
    // Delete the document record
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
      
    if (deleteError) throw deleteError;

    // Log the activity
    await logDocumentActivity(
      ActivityType.DOCUMENT_DELETED,
      id,
      `Document deleted: ${document.name}`,
      {
        entity_type: document.entity_type,
        entity_id: document.entity_id,
        file_type: document.file_type,
        file_size: document.file_size
      }
    );
    
    return null;
  });
}

// Get total count of documents
export async function getDocumentCount(): Promise<ApiResponse<number>> {
  return handleApiError(
    supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) throw error;
        return count || 0;
      })
  );
} 