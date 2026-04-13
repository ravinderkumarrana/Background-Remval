import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Trash2, 
  Eraser, 
  Sparkles, 
  Download, 
  History, 
  Undo, 
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { editImage } from '@/lib/gemini';
import { cn } from '@/lib/utils';

interface EditHistory {
  id: string;
  url: string;
  instruction: string;
  timestamp: number;
}

export default function Editor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<EditHistory[]>([]);
  const [instruction, setInstruction] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { removeImageBackground, isProcessing: isRemovingBg } = useImageProcessing();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setOriginalImage(result);
        setCurrentImage(result);
        setHistory([{ id: 'original', url: result, instruction: 'Original Upload', timestamp: Date.now() }]);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!currentImage) return;
    
    try {
      const result = await removeImageBackground(currentImage);
      setCurrentImage(result);
      addToHistory(result, 'Background Removed');
      toast.success('Background removed');
    } catch (err) {
      toast.error('Failed to remove background');
    }
  };

  const handleAiEdit = async (overrideInstruction?: string) => {
    const finalInstruction = overrideInstruction || instruction;
    if (!currentImage || !finalInstruction.trim()) return;
    
    setIsAiProcessing(true);
    try {
      // Get mime type from base64
      const mimeType = currentImage.split(';')[0].split(':')[1];
      const result = await editImage(currentImage, mimeType, finalInstruction);
      setCurrentImage(result);
      addToHistory(result, finalInstruction);
      if (!overrideInstruction) setInstruction('');
      toast.success('Image updated by AI');
    } catch (err) {
      console.error(err);
      toast.error('AI editing failed. Please try a different instruction.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const addToHistory = (url: string, instr: string) => {
    const newEntry: EditHistory = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      instruction: instr,
      timestamp: Date.now(),
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  const revertTo = (entry: EditHistory) => {
    setCurrentImage(entry.url);
    toast.info(`Reverted to: ${entry.instruction}`);
  };

  const downloadImage = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `lumina-edit-${Date.now()}.png`;
    link.click();
  };

  const reset = () => {
    setOriginalImage(null);
    setCurrentImage(null);
    setHistory([]);
    setInstruction('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {!currentImage ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
          <div className="mb-8 p-6 rounded-full bg-primary/5 text-primary">
            <Sparkles className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4">
            Professional Product Photos <br />
            <span className="text-primary">in Seconds</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mb-12">
            Upload your product photo and use AI to remove backgrounds, clean up imperfections, 
            or completely transform the scene just by typing.
          </p>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col items-center justify-center w-80 h-48 bg-white border-2 border-dashed border-zinc-200 rounded-2xl hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-zinc-400 mb-4 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-zinc-600">Click to upload image</span>
              <span className="text-xs text-zinc-400 mt-1">PNG, JPG up to 10MB</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*" 
          />
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Editor View */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="overflow-hidden border-none shadow-2xl bg-white">
              <div className="p-4 border-b flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">
                    {isRemovingBg || isAiProcessing ? 'Processing...' : 'Ready'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={reset}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={downloadImage}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="relative aspect-square md:aspect-[4/3] bg-zinc-100 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 image-checkerboard opacity-50" />
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src={currentImage}
                    alt="Current edit"
                    className="relative z-10 max-w-full max-h-full object-contain shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {(isRemovingBg || isAiProcessing) && (
                  <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-sm font-medium text-zinc-900">
                      {isRemovingBg ? 'Removing background...' : 'AI is working magic...'}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* AI Instruction Bar */}
            <Card className="p-1 glass-panel rounded-2xl">
              <div className="flex items-center gap-2 p-1">
                <div className="flex-1 relative">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input 
                    placeholder="E.g., 'Remove the dust', 'Make it look like it's on a marble table'..." 
                    className="pl-10 border-none bg-transparent focus-visible:ring-0 text-base h-12"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiEdit()}
                  />
                </div>
                <Button 
                  onClick={handleAiEdit} 
                  disabled={!instruction.trim() || isAiProcessing || isRemovingBg}
                  className="rounded-xl px-6 h-12"
                >
                  {isAiProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar Controls */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-12 border-zinc-200 hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={handleRemoveBackground}
                  disabled={isRemovingBg || isAiProcessing}
                >
                  <Eraser className="w-4 h-4 mr-3 text-primary" />
                  Remove Background
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-12 border-zinc-200 hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={() => handleAiEdit('Enhance lighting and colors for e-commerce')}
                  disabled={isRemovingBg || isAiProcessing}
                >
                  <Sparkles className="w-4 h-4 mr-3 text-amber-500" />
                  Auto Enhance
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <History className="w-4 h-4" />
                  History
                </h3>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {history.length} steps
                </Badge>
              </div>
              
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {history.map((entry, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={entry.id}
                      className={cn(
                        "group relative p-3 rounded-xl border transition-all cursor-pointer",
                        currentImage === entry.url 
                          ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20" 
                          : "bg-zinc-50 border-zinc-100 hover:border-zinc-200"
                      )}
                      onClick={() => revertTo(entry)}
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg bg-zinc-200 overflow-hidden flex-shrink-0">
                          <img 
                            src={entry.url} 
                            alt="" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-zinc-900 truncate">
                            {entry.instruction}
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-1">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {currentImage === entry.url && (
                          <CheckCircle2 className="w-4 h-4 text-primary absolute top-2 right-2" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
