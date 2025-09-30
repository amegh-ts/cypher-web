import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Bookmark } from "lucide-react";

interface PopoverOption {
  label: string;
  value: string;
  variant?: "default" | "secondary" | "outline" | "destructive" | null;
}

interface Props {
  onClick: (value: string) => void;
  options: PopoverOption[];
}

const BulkEdit = ({ onClick, options }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Bookmark className="mr-2 h-4 w-4" />
          Mark
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onClick(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BulkEdit;
