"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import SearchInput from "./ui/search";
import { Search } from "lucide-react";
import { Notes } from "@/types/Notes-type";

interface SearchContextType {
  isFocused: boolean;
  setFocused: (focused: boolean) => void;
  query: string | null;
  setquery: (query: string | null) => void;
}


const SearchContext = createContext<SearchContextType | undefined>(undefined);


export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFocused, setFocused] = useState<boolean>(false);
  const [query, setquery] = useState<string | null>("");

  return (
    <SearchContext.Provider value={{ isFocused,query,setquery, setFocused }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);

interface SearchBoxItemProps {
  data: Notes;
}
const SearchBoxItem = ({data}:SearchBoxItemProps) =>{

    return(
        <div className="border border-input">
            {data.title}
        </div>
    )
   
}

const SearchBox = () =>{
    const df = useSearchContext()
    const [NotesList,setNotesList] = useState<Array<Notes>>([]);

    async function FetchQuey(query:string | undefined |null) {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
          })

          const resrult = await res.json()
          setNotesList(resrult)

    }

    useEffect(()=>{
      if(df?.query !=""){
        FetchQuey(df?.query)
      }
        
    },[df?.query])
    return(
      <div className="w-full relative mt-3">
      {df?.isFocused ? (
        <div className="absolute max-h-48 w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm overflow-y-auto focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {NotesList.map((e, index) => (
            <SearchBoxItem data={e} key={index} />
          ))}
        </div>
      ) : null}
    </div>
    )
}

export default function NotesSeach() {

    return (
    <div>
        <SearchProvider>
            <SearchInput
                icon={<Search size={17}/>}
            />
            <SearchBox/>
        </SearchProvider>
    </div>
  )
}



