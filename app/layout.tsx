import "styles/tailwind.css"
import Script from "next/script"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {
          <Script
            id="baidu-tongji"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                var _hmt = _hmt || [];
                (function() {
                  var hm = document.createElement("script");
                  hm.src = "https://hm.baidu.com/hm.js?8321bd2330a998d38ae818a752a803f8";
                  var s = document.getElementsByTagName("script")[0];
                  s.parentNode.insertBefore(hm, s);
                })();
              `,
            }}
          />
        }
      </head>
      <body>{children}</body>
    </html>
  )
}
