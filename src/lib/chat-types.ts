export type MessageAttachment = {
  id: string;
  type: "file";
  url: string;
  filename?: string;
  mediaType: string;
};

export type MessageType = {
  id: number;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  attachments?: MessageAttachment[];
};
