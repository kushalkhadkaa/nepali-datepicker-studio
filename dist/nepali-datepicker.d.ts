declare class NepaliDatePicker {
  constructor(element: string | HTMLElement, options?: NepaliDatePicker.Options);

  setDate(date: NepaliDatePicker.DateInputWithTime): void;
  setMinDate(date: NepaliDatePicker.DateInput | null): void;
  getDate(): NepaliDatePicker.SelectedDate | null;
  getDates(): NepaliDatePicker.FormattedDate[];
  getRange(): NepaliDatePicker.DateRange | null;
  clear(): void;
  open(): void;
  close(): void;
  toggle(): void;
  setTheme(theme: NepaliDatePicker.ThemeName | string): void;
  setLang(lang: NepaliDatePicker.Language): void;
  jumpTo(year: number, month?: number): void;
  destroy(): void;

  static today(): NepaliDatePicker.BsDateWithMeta;
  static bsToAd(year: number, month: number, day: number): NepaliDatePicker.AdDateWithMeta;
  static adToBs(date: Date | string | number): NepaliDatePicker.BsDateWithMeta;
  static version: string;
}

declare namespace NepaliDatePicker {
  type Language = "ne" | "en";
  type SelectionMode = "single" | "range" | "multiple";
  type Position = "auto" | "bottom" | "top";
  type AnimationName = "slide" | "fade" | string;
  type DateFormat =
    | "YYYY-MM-DD"
    | "YYYY/MM/DD"
    | "DD/MM/YYYY"
    | "MM/DD/YYYY"
    | "Day Month Year"
    | "Day Month Year Time 12 hour"
    | "Day Month Year Time 24 hour"
    | "long"
    | string;

  type ThemeName =
    | "classic-light"
    | "classic-dark"
    | "nepali-red"
    | "ocean-blue"
    | "forest-green"
    | "sunset-orange"
    | "royal-purple"
    | "midnight"
    | "glassmorphism"
    | "neumorphism"
    | "gradient-aurora"
    | "minimal-mono"
    | "pastel-soft"
    | "corporate-blue"
    | "earthy-terracotta"
    | "neon-cyberpunk"
    | "material-design"
    | "retro-paper"
    | "high-contrast"
    | "festive-dashain"
    | "mountain-mist"
    | "tropical-teal";

  interface DateInput {
    year: number;
    month: number;
    day: number;
  }

  interface DateInputWithTime extends DateInput {
    hour?: number;
    minute?: number;
  }

  interface AdDateWithMeta extends DateInput {
    weekday: number;
    date: Date;
  }

  interface BsDateWithMeta extends DateInput {
    weekday: number;
    date: Date;
  }

  interface FormattedDate extends DateInput {
    formatted: string;
  }

  interface SelectedDate extends FormattedDate {
    adDate: AdDateWithMeta;
    hour?: number;
    minute?: number;
    formattedTime?: string;
  }

  interface DateRange {
    start: DateInput;
    end: DateInput | null;
  }

  interface RenderDayInfo extends DateInput {
    isToday: boolean;
    isDisabled: boolean;
  }

  interface Options {
    theme?: ThemeName | string;
    lang?: Language;
    mode?: SelectionMode;
    format?: DateFormat;
    inline?: boolean;
    showAdDate?: boolean;
    showHolidays?: boolean;
    showTodayBtn?: boolean;
    showClearBtn?: boolean;
    minDate?: DateInput | string | null;
    maxDate?: DateInput | string | null;
    disabledDates?: Array<DateInput | string>;
    disableDates?: Array<DateInput | string>;
    disabledDaysOfWeek?: number[];
    weekStart?: 0 | 1 | number;
    placeholder?: string;
    position?: Position;
    animate?: boolean;
    animation?: AnimationName;
    closeOnSelect?: boolean;
    unicodeDates?: boolean | null;
    unicodeDate?: boolean;
    showTithi?: boolean;
    showFiscalYear?: boolean;
    enableTime?: boolean;
    timeFormat?: string;
    presets?: boolean;
    renderDay?: (day: RenderDayInfo, cell: HTMLElement) => void;
    mobileFriendly?: boolean;
    keyboardHelp?: boolean;
    quickNav?: boolean;
    autoMask?: boolean;
    exportAdInput?: string | null;
    autoValidate?: boolean;
    highlightWeekends?: boolean;
    futureOnly?: boolean;
    pastOnly?: boolean;
    disableHolidays?: boolean;

    dateFormat?: DateFormat;
    range?: boolean;
    multiple?: boolean;
    language?: "english" | "nepali" | Language;
    onSelect?: (date: SelectedDate | FormattedDate[]) => void;

    onChange?: (date: SelectedDate | FormattedDate[] | null) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onRangeChange?: (start: DateInput | null, end: DateInput | null) => void;
    onMonthChange?: (year: number, month: number) => void;
    onToday?: () => void;
    onClear?: () => void;
  }

  interface ConverterWidgetOptions {
    theme?: ThemeName | string;
    lang?: Language;
    mode?: "bs-to-ad" | "ad-to-bs" | "diff";
  }

  interface ConverterWidgetResult {
    fromLabel: string;
    fromDate: string;
    toLabel: string;
    toDate: string;
    weekday?: string;
    diff?: unknown;
  }
}

declare class NepaliConverterWidget {
  constructor(element: string | HTMLElement, options?: NepaliDatePicker.ConverterWidgetOptions);
  setTheme(theme: NepaliDatePicker.ThemeName | string): void;
  getResult(): NepaliDatePicker.ConverterWidgetResult | null;
}

declare function Get2DigitNo(num: number | string): string;
declare function ParseDate(dateStr: string): NepaliDatePicker.DateInput | null;
declare function ConvertToDateObject(dateStr: string, format?: string): Date | null;
declare function ConvertToDateFormat(dateObj: Date, formatStr?: string): string;
declare function AD2BS(adDateStr: string): string;
declare function BS2AD(bsDateStr: string): string;
declare function ConvertToUnicode(num: number | string): string;
declare function ConvertToNumber(unicodeStr: string): number;
declare function NumberToWords(num: number): string;
declare function NumberToWordsUnicode(num: number): string;

declare namespace NDPUtils {
  function toNepali(value: number | string): string;
  function toEnglish(value: number | string): string;
  function pad(value: number | string): string;
  function bsToAd(year: number, month: number, day: number): NepaliDatePicker.AdDateWithMeta;
  function bsToAdDate(year: number, month: number, day: number): Date;
  function adToBs(date: Date | string | number): NepaliDatePicker.BsDateWithMeta;
  function getTodayBs(): NepaliDatePicker.BsDateWithMeta;
  function getDaysInMonth(year: number, month: number): number;
  function isValidBsDate(year: number, month: number, day: number): boolean;
  function isValidAdDate(year: number, month: number, day: number): boolean;
}

declare namespace AD {
  function GetCurrentDate(): Date;
  function GetCurrentYear(): number;
  function GetCurrentMonth(): number;
  function GetCurrentDay(): number;
  function GetMonths(): string[];
  function GetMonth(index: number): string;
  function GetDays(): string[];
  function GetDay(index: number): string;
  function GetDaysShort(): string[];
  function GetDayShort(index: number): string;
  function GetDaysInMonth(year: number, month: number): number;
  function DatesDiff(d1: Date | string, d2: Date | string): number;
  function AddDays(date: Date | string, days: number): Date;
  function GetFullDate(date: Date): string;
  function GetFullDay(date: Date): string;
}

declare namespace BS {
  function ValidateDate(year: number, month: number, day: number): boolean;
  function IsBetweenDates(date: NepaliDatePicker.DateInput, d1: NepaliDatePicker.DateInput, d2: NepaliDatePicker.DateInput): boolean;
  function GetCurrentDate(): NepaliDatePicker.BsDateWithMeta;
  function GetCurrentYear(): number;
  function GetCurrentMonth(): number;
  function GetCurrentDay(): number;
  function GetMonths(): string[];
  function GetMonth(index: number): string;
  function GetMonthsInUnicode(): string[];
  function GetMonthInUnicode(index: number): string;
  function GetFullDate(date: NepaliDatePicker.DateInput): string;
  function GetDaysUnicode(): string[];
  function GetDayUnicode(index: number): string;
  function GetDaysUnicodeShort(): string[];
  function GetDayUnicodeShort(index: number): string;
  function GetFullDay(date: NepaliDatePicker.DateInput): string;
  function GetFullDayInUnicode(date: NepaliDatePicker.DateInput): string;
  function GetDaysInMonth(year: number, month: number): number;
  function DatesDiff(d1: NepaliDatePicker.DateInput, d2: NepaliDatePicker.DateInput): number;
  function AddDays(date: NepaliDatePicker.DateInput, days: number): NepaliDatePicker.BsDateWithMeta;
  function IsEqualTo(d1: NepaliDatePicker.DateInput, d2: NepaliDatePicker.DateInput): boolean;
  function IsGreaterThan(d1: NepaliDatePicker.DateInput, d2: NepaliDatePicker.DateInput): boolean;
  function IsLessThan(d1: NepaliDatePicker.DateInput, d2: NepaliDatePicker.DateInput): boolean;
  function IsGreaterThanOrEqualTo(d1: NepaliDatePicker.DateInput, d2: NepaliDatePicker.DateInput): boolean;
  function IsLessThanOrEqualTo(d1: NepaliDatePicker.DateInput, d2: NepaliDatePicker.DateInput): boolean;
}

interface Window {
  NepaliDatePicker: typeof NepaliDatePicker;
  NepaliConverterWidget: typeof NepaliConverterWidget;
  NDPUtils: typeof NDPUtils;
  AD: typeof AD;
  BS: typeof BS;
  AD2BS: typeof AD2BS;
  BS2AD: typeof BS2AD;
}

export = NepaliDatePicker;
export as namespace NepaliDatePicker;
