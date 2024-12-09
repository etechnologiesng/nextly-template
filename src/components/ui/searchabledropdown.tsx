import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, ChangeEvent } from "react";

export interface Option {
  [key: string]: string; // Generic key-value pair, assumes string values
}

interface SearchableDropdownProps {
  options: Option[];
  label: string;
  id: string;
  selectedVal: string | null;
  handleChange: (value: string | null) => void;
  placeholder: string; // New prop for placeholder
  className?: string; // Optional className prop for custom styling
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  label,
  id,
  selectedVal,
  handleChange,
  placeholder,
  className = "", // Default empty string for optional styling
}) => {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.target !== inputRef.current) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);

    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const selectOption = (option: Option) => {
    setQuery("");
    handleChange(option[label]);
    setIsOpen(false);
  };

  const toggle = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    setIsOpen(e.target === inputRef.current);
  };

  const getDisplayValue = (): string => {
    if (query) return query;
    if (selectedVal) return selectedVal;

    return "";
  };

  const filterOptions = (options: Option[]): Option[] => {
    return options.filter((option) =>
      option[label].toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className={cn("relative text-gray-800 cursor-default", className)}>
      <div className="relative flex items-center">
        <div className="w-full">
          <input
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            placeholder={placeholder} // Use the new placeholder prop
            name="searchTerm"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setQuery(e.target.value);
              handleChange(null);
            }}
            onClick={toggle}
            className={cn("w-full px-4 py-2 pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 transition-all ease-in-out", className)}
          />
        </div>
        <div
          className={cn("absolute inset-y-0 right-3 flex items-center transition-transform", className)}
        >
          {/* Replacing down arrow with a search icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 11a4 4 0 118 0 4 4 0 01-8 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 17l-3.5-3.5"
            />
          </svg>
        </div>
      </div>

      <div
        className={cn(`absolute top-full  w-full mt-2 bg-white border border-gray-300 shadow-md max-h-52 min-h-48 overflow-y-auto transition-opacity ease-in-out duration-200 z-10 ${
          isOpen ? "block opacity-100" : "hidden opacity-0"
        }`, className)}
      >
        {filterOptions(options).map((option, index) => (
          <div
            key={`${id}-${index}`}
            onClick={() => selectOption(option)}
            className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
              option[label] === selectedVal ? "bg-blue-50" : ""
            }`}
          >
            {option[label]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchableDropdown;
