const SHEET_SETTINGS = {
  SHEET_FUNNELS_NAME: "funnels",
  SHEET_TEMPLATE_SETTINGS_NAME: "template_settings",
};
const GLOBAL_SETTINGS = {
  EMAIL_EFFECTIVE_USER: Session.getEffectiveUser().getEmail(),
  TESTING: false,
  TRIGGER_FUNCTION_NAME: "continuousRecruiting",
};

export { SHEET_SETTINGS, GLOBAL_SETTINGS };
