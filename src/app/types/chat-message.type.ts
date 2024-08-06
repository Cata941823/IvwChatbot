import { QuestionType } from "./question-type.type";

export interface ChatMessage {
  sentByClient: boolean;
  text: string;
  optionsList: string[];
  questionType: QuestionType;
}
