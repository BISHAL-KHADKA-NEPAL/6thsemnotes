import React from "react";
import { Note } from "../types";

interface NoteCardProps {
    note: Note;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const { title, description, pdfUrls, imageUrls, materialUrls, createdAt } = note;

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-2">
                        {title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {description}
                    </p>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-4">
                    {new Date(createdAt).toLocaleDateString()}
                </span>
            </div>

            {/* Image Preview */}
            {imageUrls && imageUrls.length > 0 && (
                <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                        src={imageUrls[0]}
                        alt={title}
                        className="w-full h-48 object-cover"
                    />
                </div>
            )}

            {/* PDF Download */}
            {pdfUrls && pdfUrls.length > 0 && (
                <a
                    href={pdfUrls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                    <span className="font-medium text-sm">Download PDF</span>
                </a>
            )}

            {/* Material Links */}
            {materialUrls.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <h4 className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-3">
                        Additional Materials
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {materialUrls.map((material, index) => (
                            <a
                                key={index}
                                href={material.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
                            >
                                <span className="material-symbols-outlined text-base">link</span>
                                <span>{material.title}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
