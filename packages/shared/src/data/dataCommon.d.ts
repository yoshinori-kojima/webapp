export interface LoginData {
  loginId : string
  password : string
};

export type FuncTreeNode = {
  nodeType: number;     // 0:root, 1:folder, 2:file
  id : string;
  name: string;
  routes: string;
  children?: FuncTrueeNode[];
}
