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
  t: (title: string) => string;

  navigate: (to: string, options?: { replace?: boolean; state?: any }) => void;
  location: {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
  }
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