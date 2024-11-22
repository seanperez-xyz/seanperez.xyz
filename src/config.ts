import { isDev } from "@builder.io/qwik/build";

export const config = {
    base_url: isDev ? "http://localhost:5173" : import.meta.env.PUBLIC_WEBSITE_URL
}