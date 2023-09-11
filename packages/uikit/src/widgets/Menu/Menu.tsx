import { useIsMounted } from "@pancakeswap/hooks";
import { AtomBox } from "@pancakeswap/ui/components/AtomBox";
import throttle from "lodash/throttle";
import React, { useEffect, useRef, useState, useMemo } from "react";
import styled from "styled-components";
import { Box } from "../../components/Box";
import Flex from "../../components/Box/Flex";
import CakePrice from "../../components/CakePrice/CakePrice";
import MenuItems from "../../components/MenuItems/MenuItems";
import { SubMenuItems, SubMenuItemsType } from "../../components/SubMenuItems";
import { useMatchBreakpoints } from "../../contexts";
import { MENU_HEIGHT, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE } from "./config";
import { MenuContext } from "./context";
import { NavProps } from "./types";
import StyledSubMenuItems, { StyledSubMenuItemWrapper } from "../../components/SubMenuItems/styles";
import { DropdownMenuItemType } from "../../components/DropdownMenu/types";
import MenuItem from "../../components/MenuItem/MenuItem";
import { OpenNewIcon } from "../../components";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  background-color: ${({ theme }) => theme.nav.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  transform: translate3d(0, 0, 0);

  padding-left: 16px;
  padding-right: 16px;
`;

const FixedContainer = styled.div<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  height: ${({ height }) => `${height}px`};
  width: 100%;
  z-index: 20;
`;

const TopBannerContainer = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  min-height: ${({ height }) => `${height}px`};
  max-height: ${({ height }) => `${height}px`};
  width: 100%;
`;

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
  max-width: 100vw;
`;

const Inner = styled.div`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`;

const Menu: React.FC<React.PropsWithChildren<NavProps>> = ({
  linkComponent = "a",
  banner,
  rightSide,
  currentLang,
  setLang,
  cakePriceUsd,
  links,
  subLinks,
  activeItem,
  activeSubItem,
  langs,
  children,
  chainId,
}) => {
  const { isMobile } = useMatchBreakpoints();
  const isMounted = useIsMounted();
  const [showMenu, setShowMenu] = useState(true);
  const refPrevOffset = useRef(typeof window === "undefined" ? 0 : window.pageYOffset);
  const pathName = window.location.pathname;
  const topBannerHeight = isMobile ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT;

  const totalTopMenuHeight = isMounted && banner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT;

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true);
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          // Has scroll up
          setShowMenu(true);
        } else {
          // Has scroll down
          setShowMenu(false);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [totalTopMenuHeight]);

  // Find the home link if provided
  const subLinksWithoutMobile = subLinks?.filter((subLink) => !subLink.isMobileOnly);
  const subLinksMobileOnly = subLinks?.filter((subLink) => subLink.isMobileOnly);
  const providerValue = useMemo(() => ({ linkComponent }), [linkComponent]);
  const isMobileOnly = false;
  const items: SubMenuItemsType[] = [
    {
      label: "Overview",
      href: "/nfts",
    },
    {
      label: "Collections",
      href: "/nfts/collections",
    },
    {
      label: "Activity",
      href: "/nfts/activity",
    },
  ];

  return (
    <MenuContext.Provider value={providerValue}>
      <AtomBox
        asChild
        minHeight={{
          xs: "auto",
          md: "100vh",
        }}
      >
        <Wrapper>
          <FixedContainer showMenu={showMenu} height={56}>
            {/* {banner && isMounted && <TopBannerContainer height={topBannerHeight}>{banner}</TopBannerContainer>} */}
            <StyledNav>
              <Flex>
                {/* <Logo href={homeLink?.href ?? "/"} /> */}
                <AtomBox style={{ display: "none" }} display={{ xs: "none", md: "block" }}>
                  <MenuItems items={links} activeItem={activeItem} activeSubItem={activeSubItem} />
                </AtomBox>
                <StyledSubMenuItems
                  justifyContent={[isMobileOnly ? "flex-end" : "start", null, "center"]}
                  pl={["12px", null, "0px"]}
                  // onScroll={debounce(layerController, 100)}
                  // ref={scrollLayerRef}
                >
                  {items.map(({ label, href, icon, itemProps, type, disabled, onClick }) => {
                    const Icon = icon;
                    const isExternalLink = type === DropdownMenuItemType.EXTERNAL_LINK;
                    const linkProps = isExternalLink
                      ? {
                          as: "a",
                          target: "_blank",
                        }
                      : {};

                    let isActive;

                    if (href === "/nfts") {
                      isActive = href === pathName;
                    } else {
                      isActive = pathName?.includes(href);
                    }

                    console.log("isActive", isActive);

                    return (
                      label && (
                        <StyledSubMenuItemWrapper key={label} mr="20px">
                          <MenuItem
                            href={href}
                            // scrollLayerRef={scrollLayerRef}
                            isActive={isActive}
                            isDisabled={disabled}
                            variant="subMenu"
                            {...itemProps}
                            {...linkProps}
                            onClick={onClick}
                          >
                            {Icon && <Icon color={isActive ? "secondary" : "textSubtle"} mr="4px" />}
                            {label}
                            {isExternalLink && (
                              <Box display={["none", null, "flex"]} style={{ alignItems: "center" }} ml="4px">
                                <OpenNewIcon color="textSubtle" />
                              </Box>
                            )}
                          </MenuItem>
                        </StyledSubMenuItemWrapper>
                      )
                    );
                  })}
                </StyledSubMenuItems>
              </Flex>
              <Flex alignItems="center" height="100%">
                <AtomBox mr="12px" display={{ xs: "none", lg: "block" }}>
                  <CakePrice chainId={chainId} showSkeleton={false} cakePriceUsd={cakePriceUsd} />
                </AtomBox>
                {rightSide}
              </Flex>
            </StyledNav>
          </FixedContainer>
          {subLinks ? (
            <Flex justifyContent="space-around" overflow="hidden">
              <SubMenuItems
                items={subLinksWithoutMobile}
                mt={`${totalTopMenuHeight + 1}px`}
                activeItem={activeSubItem}
              />

              {subLinksMobileOnly && subLinksMobileOnly?.length > 0 && (
                <SubMenuItems
                  items={subLinksMobileOnly}
                  mt={`${totalTopMenuHeight + 1}px`}
                  activeItem={activeSubItem}
                  isMobileOnly
                />
              )}
            </Flex>
          ) : (
            <div />
          )}
          <BodyWrapper mt={!subLinks ? `${totalTopMenuHeight + 1}px` : "0"}>
            <Inner>{children}</Inner>
          </BodyWrapper>
        </Wrapper>
      </AtomBox>
    </MenuContext.Provider>
  );
};

export default Menu;
