import { Card, CardBody, Flex, Heading, ProfileAvatar, NextLinkFromReactRouter } from '@pancakeswap/uikit'

import Image from 'next/image'
import styled, { css } from 'styled-components'

interface CollectionCardProps {
  bgSrc: string
  avatarSrc?: string
  collectionName: string
  url?: string
  disabled?: boolean
}

export const CollectionAvatar = styled(ProfileAvatar)`
  left: 0;
  position: absolute;
  top: -32px;
  border: 4px white solid;
`

const StyledCollectionCard = styled(Card)<{ disabled?: boolean }>`
  border-radius: 6px;
  transition: opacity 200ms;

  & > div {
    border-radius: 6px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    ${({ disabled }) =>
      disabled
        ? ''
        : css`
            &:hover {
              cursor: pointer;
              opacity: 0.6;
            }
          `}
  }
`

const StyledImage = styled(Image)`
  border-radius: 4px;
`

const CollectionCard: React.FC<React.PropsWithChildren<CollectionCardProps>> = ({
  bgSrc,
  avatarSrc,
  collectionName,
  url,
  disabled,
  children,
}) => {
  const renderBody = () => (
    <CardBody p="8px">
      <StyledImage src={bgSrc} alt={`nft-collection-card-${collectionName}`} height={125} width={375} />
      <Heading color={disabled ? 'textDisabled' : 'body'} as="h3" mb={children ? '8px' : '0'}>
        {collectionName}
      </Heading>
      {children}
    </CardBody>
  )

  return (
    <StyledCollectionCard disabled={disabled} data-test="hot-collection-card">
      {url ? (
        <NextLinkFromReactRouter to={url}>{renderBody()}</NextLinkFromReactRouter>
      ) : (
        <div style={{ cursor: 'default' }}>{renderBody()}</div>
      )}
    </StyledCollectionCard>
  )
}

export default CollectionCard
