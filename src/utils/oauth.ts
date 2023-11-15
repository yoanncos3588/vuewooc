import OAuth from "oauth-1.0a";
import CryptoJS from "crypto-js";

/**
 * Create REST API credentials for WC
 * info : https://woocommerce.github.io/woocommerce-rest-api-docs/#authentication-over-http
 */
export const oauth = new OAuth({
  consumer: { key: import.meta.env.VITE_CONSUMER_KEY, secret: import.meta.env.VITE_CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(base_string, key));
  },
});
