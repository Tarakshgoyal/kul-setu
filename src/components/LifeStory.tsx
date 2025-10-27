import React, { useState, useEffect } from 'react';
import { BookOpen, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface LifeStoryProps {
  personId: string;
  currentUserId?: string;
  personName?: string;
}

const LifeStory: React.FC<LifeStoryProps> = ({ personId, currentUserId, personName }) => {
  const [storyText, setStoryText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const canEdit = currentUserId === personId;
  const apiBaseUrl = 'https://kul-setu-backend.onrender.com';

  useEffect(() => {
    fetchLifeStory();
  }, [personId]);

  const fetchLifeStory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/life-story/${personId}`);
      
      if (response.ok) {
        const data = await response.json();
        setStoryText(data.storyText || '');
        setOriginalText(data.storyText || '');
      } else {
        console.error('Failed to fetch life story');
      }
    } catch (error) {
      console.error('Error fetching life story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${apiBaseUrl}/life-story/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personId,
          storyText,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Life story saved successfully!');
        setOriginalText(storyText);
        setIsEditing(false);
      } else {
        toast.error(data.error || 'Failed to save life story');
      }
    } catch (error) {
      console.error('Error saving life story:', error);
      toast.error('Failed to save life story');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setStoryText(originalText);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <CardTitle>Life Story</CardTitle>
          </div>
          
          {canEdit && !isEditing && (
            <Button size="sm" onClick={handleEdit} className="gap-2">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
        <CardDescription>
          {canEdit 
            ? "Share your life experiences, important events, and memorable moments" 
            : `${personName ? personName + "'s" : "Their"} life story and experiences`}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="Write about yourself... Share important events, achievements, memories, values, or anything you'd like your family to know about your life journey."
              className="min-h-[300px] resize-none"
              disabled={saving}
            />
            <div className="text-sm text-gray-500">
              {storyText.length} characters
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={saving}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Story'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            {storyText ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {storyText}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">
                  {canEdit 
                    ? "Click 'Edit' to share your life story" 
                    : "No life story shared yet"}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LifeStory;
