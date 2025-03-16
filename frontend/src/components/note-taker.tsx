import React, { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/seperator';
import { Plus, Save, Tag, Trash2, Edit2, Check, X } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: number;
}

export const NoteTaker: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');

  const createNewNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      tags: [],
      timestamp: Date.now(),
    };
    setCurrentNote(note);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!currentNote) return;

    setNotes(prev => {
      const noteIndex = prev.findIndex(n => n.id === currentNote.id);
      if (noteIndex >= 0) {
        return prev.map((note, index) =>
          index === noteIndex ? { ...currentNote, timestamp: Date.now() } : note
        );
      }
      return [...prev, { ...currentNote, timestamp: Date.now() }];
    });
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (currentNote?.id === id) {
      setCurrentNote(null);
      setIsEditing(false);
    }
  };

  const addTag = () => {
    if (!newTag.trim() || !currentNote) return;
    if (!currentNote.tags.includes(newTag.trim())) {
      setCurrentNote({
        ...currentNote,
        tags: [...currentNote.tags, newTag.trim()]
      });
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    if (!currentNote) return;
    setCurrentNote({
      ...currentNote,
      tags: currentNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Interview Notes</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={createNewNote}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Notes list */}
        <div className="w-1/3 border-r">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-2">
              {notes.map(note => (
                <Card
                  key={note.id}
                  className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                    currentNote?.id === note.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => {
                    setCurrentNote(note);
                    setIsEditing(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{note.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(note.timestamp)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Note editor */}
        <div className="flex-1">
          {currentNote ? (
            <div className="h-full flex flex-col p-4">
              <div className="flex items-center justify-between mb-4">
                {isEditing ? (
                  <Input
                    value={currentNote.title}
                    onChange={e =>
                      setCurrentNote({ ...currentNote, title: e.target.value })
                    }
                    className="text-lg font-semibold"
                    placeholder="Note title"
                  />
                ) : (
                  <h3 className="text-lg font-semibold">{currentNote.title}</h3>
                )}
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={saveNote}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentNote.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1"
                    >
                      {tag}
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        className="pl-8"
                        onKeyPress={e => e.key === 'Enter' && addTag()}
                      />
                      <Tag className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={addTag}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Separator className="mb-4" />

              {/* Content */}
              {isEditing ? (
                <Textarea
                  value={currentNote.content}
                  onChange={e =>
                    setCurrentNote({ ...currentNote, content: e.target.value })
                  }
                  placeholder="Write your notes here..."
                  className="flex-1 resize-none"
                />
              ) : (
                <ScrollArea className="flex-1">
                  <div className="whitespace-pre-wrap">
                    {currentNote.content || (
                      <span className="text-muted-foreground">No content</span>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a note or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
