import Script from "next/script";
import { GA_ID } from "@/lib/seo";

/**
 * Google Analytics 4. Page views (including client side navigation, through GA4's
 * enhanced measurement) plus a `generate_lead` event whenever someone taps WhatsApp,
 * email or phone, so enquiries can be traced back to the page and source that sent
 * them. Renders nothing until GA_ID is set in lib/seo.ts.
 */
export function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;
  var h = a.getAttribute('href') || '';
  var method = h.indexOf('https://wa.me/') === 0 ? 'whatsapp' : h.indexOf('mailto:') === 0 ? 'email' : h.indexOf('tel:') === 0 ? 'phone' : '';
  if (method) gtag('event', 'generate_lead', { method: method, page_path: location.pathname });
});`}
      </Script>
    </>
  );
}
