import React from 'react';
import { RedactionReport } from '../types';
import { Mail, Linkedin, Instagram, Copy } from 'lucide-react';

const CopyButton = ({ text }: { text: string }) => (
  <button 
    onClick={() => navigator.clipboard.writeText(text)}
    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
    title="Copier le texte"
  >
    <Copy size={16} />
  </button>
);

const RedactionReportDisplay: React.FC<{ data: RedactionReport }> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      
      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm relative">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center gap-2">
           <Mail size={18} className="text-zinc-600" />
           <span className="font-bold text-zinc-700 text-sm uppercase tracking-wide">Email Vendeur</span>
        </div>
        <div className="p-6 whitespace-pre-wrap font-sans text-zinc-800 leading-relaxed text-sm md:text-base relative group">
           {data.email_vendor}
           <CopyButton text={data.email_vendor} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        <div className="bg-white border border-blue-100 rounded-lg shadow-sm relative overflow-hidden">
           <div className="h-1 bg-[#0077b5]"></div>
           <div className="p-4 flex items-center gap-2">
              <Linkedin size={18} className="text-[#0077b5]" />
              <span className="font-bold text-zinc-700 text-sm uppercase tracking-wide">Post LinkedIn</span>
           </div>
           <div className="p-6 whitespace-pre-wrap font-sans text-zinc-800 text-sm relative group">
              {data.social_post_linkedin}
              <CopyButton text={data.social_post_linkedin} />
           </div>
        </div>

        <div className="bg-white border border-pink-100 rounded-lg shadow-sm relative overflow-hidden">
           <div className="h-1 bg-gradient-to-r from-purple-500 to-orange-500"></div>
           <div className="p-4 flex items-center gap-2">
              <Instagram size={18} className="text-pink-600" />
              <span className="font-bold text-zinc-700 text-sm uppercase tracking-wide">Post Instagram</span>
           </div>
           <div className="p-6 whitespace-pre-wrap font-sans text-zinc-800 text-sm relative group">
              {data.social_post_instagram}
              <CopyButton text={data.social_post_instagram} />
           </div>
        </div>

      </div>

    </div>
  );
};

export default RedactionReportDisplay;