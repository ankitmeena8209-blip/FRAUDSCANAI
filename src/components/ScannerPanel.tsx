import { motion } from 'framer-motion';
import { FileImage, FileText, Link2, MessageSquareText, ScanLine, Sparkles, UploadCloud, XCircle } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SCAN_TABS, SAMPLE_CONTENT } from '../data/samples';
import type { ScanType } from '../types';
import { classNames } from '../utils/helpers';

const schema = z.object({
  content: z.string().min(10, 'Please provide a bit more context to scan.'),
});

interface ScannerPanelProps {
  selectedTab: ScanType;
  onTabChange: (tab: ScanType) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  filePreview: string | null;
  setFilePreview: (value: string | null) => void;
  onScan: (content: string, mode: ScanType) => void;
  isScanning: boolean;
  loadingStep: number;
  setLoadingStep: (value: number) => void;
}

export function ScannerPanel({
  selectedTab,
  onTabChange,
  inputValue,
  setInputValue,
  filePreview,
  setFilePreview,
  onScan,
  isScanning,
  setLoadingStep,
}: ScannerPanelProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ content: string }>({
    resolver: zodResolver(schema),
    defaultValues: { content: inputValue },
  });

  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setUploadError('Only image and PDF uploads are supported.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(typeof reader.result === 'string' ? reader.result : null);
      setUploadError(null);
      setInputValue(`${inputValue}\n[Uploaded ${file.name}]`);
    };
    reader.readAsDataURL(file);
  }, [inputValue, setInputValue, setFilePreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [], 'application/pdf': [] } });

  const inputPlaceholder = useMemo(() => {
    switch (selectedTab) {
      case 'fake-news':
        return 'Paste a headline, article snippet, or social post...';
      case 'scam-message':
        return 'Paste the suspicious SMS, chat, or WhatsApp content...';
      case 'phishing-link':
        return 'Paste the URL or suspicious domain you want to inspect...';
      case 'email':
        return 'Paste the email body or subject line...';
      default:
        return 'Describe the screenshot or paste the visible text...';
    }
  }, [selectedTab]);

  const onSubmit = ({ content }: { content: string }) => {
    onScan(content, selectedTab);
    setLoadingStep(0);
  };

  const applySample = () => {
    const sample = SAMPLE_CONTENT[selectedTab];
    setInputValue(sample);
    reset({ content: sample });
    setFilePreview(null);
    setUploadError(null);
  };

  const charCount = inputValue.length;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 flex-nowrap -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-x-visible">
        {SCAN_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id as ScanType)}
            className={classNames(
              'rounded-full border px-4 py-2 text-sm transition duration-300',
              selectedTab === tab.id
                ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-200 shadow-lg shadow-cyan-500/10'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
            )}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            {selectedTab === 'fake-news' && <FileText className="h-4 w-4" />}
            {selectedTab === 'scam-message' && <MessageSquareText className="h-4 w-4" />}
            {selectedTab === 'phishing-link' && <Link2 className="h-4 w-4" />}
            {selectedTab === 'email' && <FileText className="h-4 w-4" />}
            {selectedTab === 'screenshot' && <FileImage className="h-4 w-4" />}
            <span>Adaptive analysis mode</span>
          </div>
          <span className={classNames(charCount > 260 ? 'text-amber-400' : 'text-slate-400')}>{charCount}/320</span>
        </div>

        <textarea
          {...register('content')}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          rows={8}
          maxLength={320}
          placeholder={inputPlaceholder}
          className="min-h-[220px] w-full resize-none rounded-[20px] border border-white/10 bg-slate-900/70 p-4 text-sm outline-none transition focus:border-cyan-400/40"
        />

        {errors.content && <p className="text-sm text-rose-400">{errors.content.message}</p>}

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={applySample} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/20">Load sample</button>
          <button type="button" onClick={() => setInputValue('')} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">Clear</button>
          <button type="button" onClick={() => navigator.clipboard.writeText(inputValue)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">Paste</button>
        </div>

        <div {...getRootProps()} className={classNames('rounded-[20px] border border-dashed p-4 text-center transition', isDragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/10 bg-slate-900/60')}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-400">
            <UploadCloud className="h-5 w-5 text-cyan-300" />
            <p>Drop an image or PDF, or click to upload</p>
          </div>
        </div>

        {uploadError && <p className="text-sm text-rose-400">{uploadError}</p>}

        {filePreview && (
          <div className="rounded-[20px] border border-white/10 bg-slate-900/70 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300">Preview</p>
              <button type="button" onClick={() => setFilePreview(null)} className="rounded-full p-1 text-slate-400 hover:bg-white/10">
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            {filePreview.startsWith('data:image') ? (
              <img src={filePreview} alt="Upload preview" className="mt-3 max-h-44 rounded-[16px] object-contain" />
            ) : (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                <FileText className="h-4 w-4" />
                <span>PDF attached</span>
              </div>
            )}
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isScanning || charCount < 10}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isScanning ? (
            <>
              <ScanLine className="h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Run Full Scan
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
