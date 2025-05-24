import './globals.css';
import { Providers } from './provider';
import {
  Cormorant_Infant,
  Encode_Sans_Semi_Condensed,
  Merienda,
  Noto_Sans_JP,
  Open_Sans,
  Plus_Jakarta_Sans,
  Inter,
} from 'next/font/google';
import ThemeRegistry from './ThemeRegistry';
// import ThemeProviderWrapper from '@/components/ThemeContext';


const cormorant = Cormorant_Infant({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-cormorant' });
const encodeSans = Encode_Sans_Semi_Condensed({ subsets: ['latin'], weight: ['100','200','300','400','500','600','700','800','900'], variable: '--font-encode' });
const merienda = Merienda({ subsets: ['latin'], weight: ['300','400','500','600','700','800','900'], variable: '--font-merienda' });
const notoJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['100','200','300','400','500','600','700','800','900'], variable: '--font-notojp' });
const openSans = Open_Sans({ subsets: ['latin'], weight: ['300','400','500','600','700','800'], variable: '--font-opensans' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['200','300','400','500','600','700','800'], variable: '--font-jakarta' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Band Test',
  description: 'An Interview',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={notoJP.className}>
        <ThemeRegistry>
          <Providers>
            {children}
          </Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
