class Bookmark {
	key: string;
	bookKey: string;
	cfi: string;
	label: string;
	percentage: number;
	chapter: string;
	constructor(
		key: string,
		bookKey: string,
		cfi: string,
		label: string,
		percentage: number,
		chapter: string,
	) {
		this.key = key;
		this.bookKey = bookKey;
		this.cfi = cfi;
		this.label = label;
		this.percentage = percentage;
		this.chapter = chapter;
	}
}

export default Bookmark;