import i18n from "i18n-js";

import en from "./locales/en.json";
import zh from "./locales/zh.json";

i18n.defaultLocale = "zh";
i18n.locale = "zh";
i18n.fallbacks = true;
i18n.translations = { en, zh };

export default i18n;
