export interface SidebarProps {
  mode: string;
  isCollapsed: boolean;
  shelfIndex: number;

  handleMode: (mode: string) => void;
  handleSearch: (isSearch:boolean) => void;
  handleCollapse: (isCollapsed: boolean) => void;
  handleSortDisplay: (isSortDisplay: boolean) => void;
  handleSelectBook: (isSelectBook: boolean) => void;
  handleShelfIndex: (shelfIndex: number) => void;

}

export interface SidebarState {
  index: number;
  hoverIndex: number;
  hoverShelfIndex: number;
  isCollapsed: boolean;
  isCollpaseShelf: boolean;
  shelfIndex: number;
  isOpenDelete: boolean;
}