import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";

export function ApiFilter({
  selected,
  onChange,
  logTypes,
}: {
  selected: string[];
  onChange: (value: string[]) => void;
  logTypes: string[];
}) {
  const toggleType = (type: string) => {
    onChange(
      selected.includes(type)
        ? selected.filter((t) => t !== type)
        : [...selected, type]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={selected.length > 1 ? "default" : "outline"} size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52">
        <div className="grid gap-2">
          {logTypes.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2 text-sm cursor-pointer"
            >
              <Checkbox
                checked={selected.includes(type)}
                onCheckedChange={() => toggleType(type)}
                id={`filter-${type}`}
              />
              <span>{type.replace("_", " ")}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
