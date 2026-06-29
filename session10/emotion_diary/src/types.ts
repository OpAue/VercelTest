export type DiaryItem = {
  id: number | string;
  createdDate: number;
  emotionId: number;
  content: string;
};

export type EditorInput = {
  createdDate: Date;
  emotionId: number;
  content: string;
};

export type ButtonType = "POSITIVE" | "NEGATIVE" | "DEFAULT";