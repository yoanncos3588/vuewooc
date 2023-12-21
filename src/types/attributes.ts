export interface Attribute {
  id: number;
  name: string;
  type: string;
  orderBy: string;
}

export interface AttributeTerm {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}
