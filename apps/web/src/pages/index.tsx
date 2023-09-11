import { useRouter } from 'next/router'
import { useEffect } from 'react'

const IndexPage = () => {
  const { push } = useRouter()

  useEffect(() => {
    push('/nfts')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}

export default IndexPage
