import localFont from 'next/font/local'
import { Russo_One, Anton } from 'next/font/google'

export const pretendard = localFont({
  src: [
    {
      path: '../fonts/Pretendard-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../fonts/Pretendard-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../fonts/Pretendard-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/Pretendard-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Pretendard-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Pretendard-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/Pretendard-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Pretendard-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../fonts/Pretendard-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],

  display: 'swap',
  variable: '--font-pretendard',
});

export const russoOne = Russo_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-russo-one',
})

export const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
})