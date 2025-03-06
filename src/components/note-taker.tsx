"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Save, Download, Copy, Trash } from "lucide-react";

export default function NoteTaker() {
  const [notes, setNotes] = useState<string>("");
  const [savedNotes, setSavedNotes] = useState<
    Array<{ id: string; text: string; timestamp: Date }>
  >([]);

  const handleSaveNote = () => {
    if (notes.trim()) {
      const newNote = {
        id: Date.now().toString(),
        text: notes,
        timestamp: new Date(),
      };

      setSavedNotes([...savedNotes, newNote]);
      setNotes("");
    }
  };

  const handleDeleteNote = (id: string) => {
    setSavedNotes(savedNotes.filter((note) => note.id !== id));
  };

  const handleCopyNote = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleExportNotes = () => {
    const notesText = savedNotes
      .map((note) => `[${note.timestamp.toLocaleString()}]\n${note.text}\n\n`)
      .join("---\n\n");

    const blob = new Blob([notesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `interview-notes-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Interview Notes</span>
          {savedNotes.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportNotes}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col">
        <div className="mb-4">
          <Textarea
            placeholder="Take notes during your interview..."
            className="min-h-[100px] resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-auto">
          {savedNotes.length > 0 ? (
            <div className="space-y-3">
              {savedNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-slate-500">
                      {formatTimestamp(note.timestamp)}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleCopyNote(note.text)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400 text-sm">
              Your saved notes will appear here
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          className="w-full"
          onClick={handleSaveNote}
          disabled={!notes.trim()}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Note
        </Button>
      </CardFooter>
    </Card>
  );
}
