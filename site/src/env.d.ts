interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly PUBLIC_UMAMI_WEBSITE_ID?: string;
  readonly PUBLIC_UMAMI_SCRIPT_URL?: string;
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
