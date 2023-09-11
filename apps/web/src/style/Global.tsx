import { createGlobalStyle } from 'styled-components'
import { PancakeTheme } from '@pancakeswap/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Arial', sans-serif;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }

    th {
      background: black;
      color: white !important;
    }
    tr:nth-child(even) {
      background: white;
    }
    tr:nth-child(odd) {
      background: rgba(0, 0, 0, 0.04);
    }
  }
`

export default GlobalStyle
