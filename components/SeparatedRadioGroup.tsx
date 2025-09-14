// components/SeparatedRadioGroup.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Option = {
  value: string | number;
  label: string;
  info?: string; // <-- markdown autorisé ici
};

type RadioGroupProps = {
  name: string;
  value: string | number | null;
  onValueChangeAction: (v: string | number) => void;
  options: Option[];
  title: string;
  hint?: string; // <-- peut aussi être en markdown si tu veux
  showInfoBadge?: boolean;
};

export function SeparatedRadioGroup({
  name,
  value,
  onValueChangeAction,
  options,
  title,
  hint,
  showInfoBadge,
}: RadioGroupProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      {hint && (
        <div className="prose prose-sm max-w-none text-gray-500 mb-5">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{hint}</ReactMarkdown>
        </div>
      )}

      <div className="space-y-4">
        {options.map((opt, idx) => {
          console.log("info: ", opt);
          const selected = value === opt.value;
          const open = openIdx === idx;

          return (
            <div key={opt.value} className="relative">
              <div
                className={[
                  "flex items-start justify-between gap-4 rounded-2xl border transition shadow-sm p-4",
                  selected
                    ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-100"
                    : "border-gray-200 hover:bg-gray-50",
                ].join(" ")}
              >
                <label className="flex-1 cursor-pointer flex items-start gap-3">
                  <input
                    type="radio"
                    name={name}
                    className="mt-1 h-4 w-4 shrink-0"
                    checked={selected}
                    onChange={() => onValueChangeAction(opt.value)}
                  />
                  <div className="flex items-start gap-2 text-">
                    {showInfoBadge && opt.info && (
                      <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                        i
                      </span>
                    )}
                    <span className="leading-6 text-gray-900 font-medium">{opt.label}</span>
                  </div>
                </label>

                {opt.info && (
                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? null : idx)}
                    className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 transition"
                    aria-expanded={open}
                    aria-controls={`info-${name}-${idx}`}
                  >
                    <Info className="h-4 w-4" />
                    Infos
                    <ChevronDown
                      className={["h-4 w-4 transition-transform", open ? "rotate-180" : ""].join(
                        " "
                      )}
                    />
                  </button>
                )}
              </div>

              <AnimatePresence initial={false}>
                {opt.info && open && (
                  <motion.div
                    id={`info-${name}-${idx}`}
                    initial={{ height: 0, opacity: 0, y: -5 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -5 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="prose prose-sm text-sm max-w-none text-gray-500 mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{opt.info}</ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}
