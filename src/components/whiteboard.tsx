"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  Pen,
  Eraser,
  Square,
  Circle,
  ArrowRight,
  Undo,
  Redo,
  Download,
  Trash2,
} from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface DrawingElement {
  type: "freehand" | "line" | "rectangle" | "circle" | "arrow";
  points: Point[];
  color: string;
  width: number;
  fill?: boolean;
}

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [history, setHistory] = useState<DrawingElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(
    null
  );
  const [tool, setTool] = useState<
    "pen" | "eraser" | "rectangle" | "circle" | "arrow"
  >("pen");
  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(2);

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions to match parent
      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
        }
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      if (ctx) {
        // Set default styles
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        setContext(ctx);
      }

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, []);

  // Redraw canvas when elements change
  useEffect(() => {
    if (context && canvasRef.current) {
      // Clear canvas
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Draw all elements
      elements.forEach((element) => {
        drawElement(context, element);
      });
    }
  }, [elements, context]);

  // Draw a single element
  const drawElement = (
    ctx: CanvasRenderingContext2D,
    element: DrawingElement
  ) => {
    const { type, points, color, width, fill } = element;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.fillStyle = color;

    ctx.beginPath();

    switch (type) {
      case "freehand":
        if (points.length > 0) {
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
        }
        ctx.stroke();
        break;

      case "line":
        if (points.length >= 2) {
          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(points[1].x, points[1].y);
        }
        ctx.stroke();
        break;

      case "rectangle":
        if (points.length >= 2) {
          const width = points[1].x - points[0].x;
          const height = points[1].y - points[0].y;
          if (fill) {
            ctx.fillRect(points[0].x, points[0].y, width, height);
          }
          ctx.strokeRect(points[0].x, points[0].y, width, height);
        }
        break;

      case "circle":
        if (points.length >= 2) {
          const radius = Math.sqrt(
            Math.pow(points[1].x - points[0].x, 2) +
              Math.pow(points[1].y - points[0].y, 2)
          );
          ctx.arc(points[0].x, points[0].y, radius, 0, 2 * Math.PI);
          if (fill) {
            ctx.fill();
          }
          ctx.stroke();
        }
        break;

      case "arrow":
        if (points.length >= 2) {
          // Draw line
          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(points[1].x, points[1].y);
          ctx.stroke();

          // Draw arrowhead
          const angle = Math.atan2(
            points[1].y - points[0].y,
            points[1].x - points[0].x
          );
          const headLength = 15;

          ctx.beginPath();
          ctx.moveTo(points[1].x, points[1].y);
          ctx.lineTo(
            points[1].x - headLength * Math.cos(angle - Math.PI / 6),
            points[1].y - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            points[1].x - headLength * Math.cos(angle + Math.PI / 6),
            points[1].y - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }
        break;
    }
  };

  // Handle mouse down event
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDrawing(true);

    const newElement: DrawingElement = {
      type: tool === "eraser" ? "freehand" : tool,
      points: [{ x, y }],
      color: tool === "eraser" ? "#FFFFFF" : color,
      width: tool === "eraser" ? 20 : width,
      fill: false,
    };

    setCurrentElement(newElement);
  };

  // Handle mouse move event
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !currentElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const updatedElement = {
      ...currentElement,
      points: [...currentElement.points, { x, y }],
    };

    setCurrentElement(updatedElement);

    // Draw the current element
    if (context) {
      // Clear canvas and redraw all elements
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Draw existing elements
      elements.forEach((element) => {
        drawElement(context, element);
      });

      // Draw current element
      drawElement(context, updatedElement);
    }
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    if (!drawing || !currentElement) return;

    setDrawing(false);

    // Add current element to elements array
    const updatedElements = [...elements, currentElement];
    setElements(updatedElements);

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setCurrentElement(null);
  };

  // Handle mouse leave event
  const handleMouseLeave = () => {
    if (drawing) {
      handleMouseUp();
    }
  };

  // Undo last action
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setElements([]);
    }
  };

  // Redo last undone action
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // Clear whiteboard
  const handleClear = () => {
    setElements([]);
    setHistory([]);
    setHistoryIndex(-1);
  };

  // Save whiteboard as image
  const handleSave = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  // Available colors
  const colors = [
    "#000000", // Black
    "#FF0000", // Red
    "#0000FF", // Blue
    "#008000", // Green
    "#FFA500", // Orange
    "#800080", // Purple
    "#FF00FF", // Magenta
    "#A52A2A", // Brown
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className={tool === "pen" ? "bg-gray-200 dark:bg-gray-700" : ""}
            onClick={() => setTool("pen")}
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={tool === "eraser" ? "bg-gray-200 dark:bg-gray-700" : ""}
            onClick={() => setTool("eraser")}
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={
              tool === "rectangle" ? "bg-gray-200 dark:bg-gray-700" : ""
            }
            onClick={() => setTool("rectangle")}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={tool === "circle" ? "bg-gray-200 dark:bg-gray-700" : ""}
            onClick={() => setTool("circle")}
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={tool === "arrow" ? "bg-gray-200 dark:bg-gray-700" : ""}
            onClick={() => setTool("arrow")}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {colors.map((c) => (
              <div
                key={c}
                className={`w-5 h-5 rounded-full cursor-pointer ${
                  color === c ? "ring-2 ring-offset-1 ring-blue-500" : ""
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <div className="w-24 flex items-center space-x-2">
            <span className="text-xs">Width:</span>
            <Slider
              value={[width]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setWidth(value[0])}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={historyIndex < 0}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 dark:border-gray-700 relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    </div>
  );
}
