import { useEffect, useState, useMemo } from "react";
import axios from "axios";

type Country = {
  name: { common: string };
  idd: { root: string; suffixes: string[] };
  cca2: string;
};

type Props = {
  onChange: (code: string) => void;
};

export default function CountrySelect({ onChange }: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((res) => {
      const filtered = res.data.filter((c: Country) => c.idd?.root && c.idd.suffixes && c.idd.suffixes.length > 0);
      setCountries(filtered);
    });
  }, []);

  const filteredCountries = useMemo(() => {
    const searchLower = search.toLowerCase();
    const searchCode = search.replace("+", "");
    return countries.filter((country) => {
      const code = country.idd.root + (country.idd.suffixes?.[0] || "");
      return (
        country.name.common.toLowerCase().includes(searchLower) ||
        code.replace("+", "").includes(searchCode)
      );
    });
  }, [countries, search]);

  return (
    <div>
      <select
        className="p-3 border-2 border-blue-300 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-blue-700 font-semibold transition-all hover:border-blue-400"
        onChange={(e) => { onChange(e.target.value); }}
        defaultValue=""
      >
        <option value="">
           Select Country Code
        </option>
        {filteredCountries
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .map((country) => {
            const code = country.idd.root + (country.idd.suffixes?.[0] || "");
            return (
              <option key={country.cca2} value={code}>
                {country.name.common} ({code})
              </option>
            );
          })}
      </select>
    </div>
  );
}
