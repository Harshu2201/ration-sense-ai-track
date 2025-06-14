
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const languages = [
  { code: 'hindi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'english', name: 'English', flag: '🇬🇧' },
  { code: 'tamil', name: 'தமிழ் (Tamil)', flag: '🏁' },
  { code: 'bengali', name: 'বাংলা (Bengali)', flag: '🏁' },
  { code: 'telugu', name: 'తెలుగు (Telugu)', flag: '🏁' },
  { code: 'marathi', name: 'मराठी (Marathi)', flag: '🏁' },
];

export const LanguageSelector = ({ value, onValueChange }: LanguageSelectorProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
