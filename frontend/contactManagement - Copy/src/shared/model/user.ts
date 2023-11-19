
export interface Num {
  number: string,
  type: string
}
export interface History {
  type: string;
  content: string;
  timestamp: string; // This should be a string in ISO 8601 format
}
export interface FileDetails {
  fileName: string,
  fileUrl: string;
}
export interface User {
  _id: string,
  name: string,
  email: string,
  company: string,
  role: string,
  phonenumber: Array<Num>,
  createdBy: string,
  notes: string,
  isAdmin: boolean,
  gender:string,
  attachments: Array<FileDetails>,
  history : Array<History>
}
