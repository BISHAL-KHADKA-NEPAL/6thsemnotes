export interface Subject {
  id: string;
  title: string;
  iconName: string;
  colorTheme: {
    bg: string;
    text: string;
    darkBg: string;
    darkText: string;
  };
}

export interface Note {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  pdfUrls: string[];
  imageUrls: string[];
  materialUrls: Array<{
    title: string;
    url: string;
  }>;
  createdAt: string;
}