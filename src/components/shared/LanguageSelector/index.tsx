'use client'
import { useMemo, useState } from 'react'
import { useMonaco } from '@monaco-editor/react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

type LanguageSelectorProps = {
  value: string
  onChange: (value: string) => void
}

export const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  const monaco = useMonaco()
  const [open, setOpen] = useState(false)

  const AllLanguages = useMemo(() => {
    const languages = monaco?.languages?.getLanguages()
    if (!languages) return []
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
          {value
            ? AllLanguages.find((language) => language.id === value)?.id
            : 'Select language...'}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {AllLanguages.map((language: any) => (
                <CommandItem
                  key={language.id}
                  value={language.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue) // ✅ update react-hook-form
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === language.id ? 'opacity-100' : 'opacity-0'
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
