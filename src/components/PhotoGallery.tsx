import React, { useState, useEffect, useRef } from 'react';
import { Camera, Plus, X, Edit2, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Photo {
  photoId: string;
  personId: string;
  photoUrl: string;
  description: string;
  uploadDate: string;
  isPublic: boolean;
  displayOrder: number;
}

interface PhotoGalleryProps {
  personId: string;
  currentUserId?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ personId, currentUserId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  
  // Upload form state
  const [photoUrl, setPhotoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Check if current user can manage photos for this person
  const canManagePhotos = currentUserId === personId;

  const apiBaseUrl = 'https://kul-setu-backend.onrender.com';

  // Fetch photos on component mount
  useEffect(() => {
    fetchPhotos();
  }, [personId]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/photos/${personId}`);
      
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      } else {
        console.error('Failed to fetch photos');
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection from device
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile && !photoUrl) {
      toast.error('Please select an image or provide a URL');
      return;
    }

    if (!canManagePhotos) {
      toast.error('You can only upload photos to your own profile');
      return;
    }

    try {
      setUploading(true);
      let imageUrl = photoUrl;

      // If a file was selected, convert to base64
      if (selectedFile) {
        imageUrl = await fileToBase64(selectedFile);
      }

      const response = await fetch(`${apiBaseUrl}/photos/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personId,
          photoUrl: imageUrl,
          description,
          isPublic,
          uploadedByUserId: currentUserId,
          displayOrder: photos.length
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Photo uploaded successfully!');
        setIsUploadModalOpen(false);
        resetUploadForm();
        fetchPhotos();
      } else {
        toast.error(data.error || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!canManagePhotos) {
      toast.error('You can only delete your own photos');
      return;
    }

    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/photos/delete/${photoId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Photo deleted successfully!');
        fetchPhotos();
      } else {
        toast.error(data.error || 'Failed to delete photo');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  const handleUpdatePhoto = async () => {
    if (!editingPhoto) return;

    if (!canManagePhotos) {
      toast.error('You can only edit your own photos');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/photos/update/${editingPhoto.photoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: editingPhoto.description,
          isPublic: editingPhoto.isPublic,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Photo updated successfully!');
        setEditingPhoto(null);
        fetchPhotos();
      } else {
        toast.error(data.error || 'Failed to update photo');
      }
    } catch (error) {
      console.error('Error updating photo:', error);
      toast.error('Failed to update photo');
    }
  };

  const resetUploadForm = () => {
    setPhotoUrl('');
    setDescription('');
    setIsPublic(true);
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-purple-600" />
            <CardTitle>Photo Gallery</CardTitle>
          </div>
          
          {canManagePhotos && (
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Upload New Photo</DialogTitle>
                  <DialogDescription>
                    Upload from your device, take a photo, or provide a URL
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upload">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </TabsTrigger>
                    <TabsTrigger value="camera">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </TabsTrigger>
                    <TabsTrigger value="url">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Image URL
                    </TabsTrigger>
                  </TabsList>

                  {/* Upload from Device */}
                  <TabsContent value="upload" className="space-y-4 py-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
                         onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm font-medium mb-2">
                        {selectedFile ? selectedFile.name : 'Click to select an image'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports: JPG, PNG, GIF (Max 5MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    {previewUrl && (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full max-h-64 object-contain bg-gray-50"
                        />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setPreviewUrl('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Take Photo with Camera */}
                  <TabsContent value="camera" className="space-y-4 py-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
                         onClick={() => cameraInputRef.current?.click()}>
                      <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm font-medium mb-2">
                        {selectedFile ? selectedFile.name : 'Click to open camera'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Take a photo using your device camera
                      </p>
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    {previewUrl && (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full max-h-64 object-contain bg-gray-50"
                        />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setPreviewUrl('');
                            if (cameraInputRef.current) cameraInputRef.current.value = '';
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Image URL */}
                  <TabsContent value="url" className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium">Photo URL</label>
                      <Input
                        placeholder="https://example.com/photo.jpg"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Common fields for all upload methods */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Add a description for this photo..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="isPublic" className="text-sm">
                      Make photo public
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      resetUploadForm();
                    }}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUploadPhoto} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <CardDescription>
          {photos.length === 0 ? 'No photos yet' : `${photos.length} photo${photos.length !== 1 ? 's' : ''}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading photos...</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Camera className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No photos in this gallery yet</p>
            {canManagePhotos && (
              <p className="text-sm mt-1">Click "Upload Photo" to add your first photo</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
            {photos.map((photo) => (
              <div key={photo.photoId} className="relative group rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={photo.photoUrl}
                    alt={photo.description || 'Photo'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Available';
                    }}
                  />
                </div>
                
                {photo.description && (
                  <div className="p-3 bg-white">
                    <p className="text-sm text-gray-700 line-clamp-2">{photo.description}</p>
                  </div>
                )}
                
                {canManagePhotos && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 shadow-md"
                          onClick={() => setEditingPhoto(photo)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Photo</DialogTitle>
                          <DialogDescription>
                            Update the description of your photo
                          </DialogDescription>
                        </DialogHeader>
                        
                        {editingPhoto && (
                          <div className="space-y-4 py-4">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={editingPhoto.photoUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Description</label>
                              <Textarea
                                value={editingPhoto.description}
                                onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="editIsPublic"
                                checked={editingPhoto.isPublic}
                                onChange={(e) => setEditingPhoto({ ...editingPhoto, isPublic: e.target.checked })}
                                className="h-4 w-4"
                              />
                              <label htmlFor="editIsPublic" className="text-sm">
                                Make photo public
                              </label>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setEditingPhoto(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdatePhoto}>
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 shadow-md"
                      onClick={() => handleDeletePhoto(photo.photoId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoGallery;
