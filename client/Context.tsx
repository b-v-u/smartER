import {createContext, useContext, Dispatch, SetStateAction} from 'react';
import {StringLiteral} from 'typescript';

// Login context
export type LoginContextType = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
};

const defaultState = {
  email: '',
  setEmail: () => {},
  password: '',
  setPassword: () => {},
};

export const LoginContext = createContext<LoginContextType | undefined>(
  defaultState
);

//Homepage Context
export type HomepageContextType = {
  home: string;
  setHome: Dispatch<SetStateAction<string>>;
  queryString: string;
  setQueryString: Dispatch<SetStateAction<string>>;
  history: historyType[];
  setHistory: Dispatch<SetStateAction<historyType[]>>;
  uri: string;
  setUri: Dispatch<SetStateAction<string>>;
  dbCredentials: dbCredentialsType;
  setDBCredentials: Dispatch<SetStateAction<dbCredentialsType>>;
};

const defaultHomeState = {
  home: 'HOMEPAGE',
  setHome: () => {},
  queryString: '',
  setQueryString: () => {},
  history: [],
  setHistory: () => {},
  uri: '',
  setUri: () => {},
  dbCredentials: {
    host: '',
    port: 0,
    dbUsername: '',
    dbPassword: '',
    database: '',
  },
  setDBCredentials: () => {},
};

export const HomepageContext = createContext<HomepageContextType | undefined>(
  defaultHomeState
);

//History [{created_at: string, query: string}]

//TYPES
interface historyType {
  created_at: string;
  query: string;
}

export interface dbCredentialsType {
  host: string;
  port: number;
  dbUsername: string;
  dbPassword: string;
  database: string;
}

//TODO: Create state for Nodes
/*
//State to manage:
[]Nodes
[x]Query
[x]History
[x]Settings

*/
