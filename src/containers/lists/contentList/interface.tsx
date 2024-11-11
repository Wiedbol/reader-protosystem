import HtmlBookModel from '../../../models/HtmlBook'
import BookModel from '../../../models/Book'


export interface ContentListProps {
  currentBook: BookModel;
  chapters: any;
  htmlBook: any;
  renderBookFunc: (id: string) => void;
  handleCurrentChapter: (currentChapter: string) => void;
  handleCurrentChapterIndex: (currentChapterIndex: number) => void;
}