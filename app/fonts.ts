import localFont from 'next/font/local'

export const bitter = localFont({
  src: [
    {
      path: '../public/fonts/Bitter-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Bitter-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-heading',
  display: 'swap',
})

export const montserrat = localFont({
  src: [
    {
      path: '../public/fonts/Montserrat-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Montserrat-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Montserrat-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Montserrat-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
})