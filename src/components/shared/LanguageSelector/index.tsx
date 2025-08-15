'use client'
import { useEffect, useMemo, useState } from 'react';

import { useMonaco } from '@monaco-editor/react';
import { Popover } from '@/components/ui/popover';
import { PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, CheckIcon, ChevronsUpDown, ChevronsUpDownIcon } from 'lucide-react';
import { PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';


export const LanguageSelector = () => {
  const monaco = useMonaco()
  const [open, setOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("")
  console.log(selectedLanguage)
  const AllLanguages = useMemo(() => {
    const languages = monaco?.languages?.getLanguages()
    if (!languages) return []
    console.log(languages)
    return languages

  }, [monaco])
  return (

    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedLanguage
            ? AllLanguages.find((language) => language.id === selectedLanguage)?.id
            : "Select language..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {AllLanguages.map((language:any) => (
                <CommandItem
                  key={language.id}
                  value={language.id}
                  onSelect={(currentValue) => {
                    setSelectedLanguage(currentValue === selectedLanguage ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLanguage === language.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {language.aliases?.[0] || language.id}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList> 
        </Command>
      </PopoverContent>
    </Popover>
  )
}
