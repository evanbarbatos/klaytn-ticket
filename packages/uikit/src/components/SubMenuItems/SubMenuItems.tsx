import { AtomBox } from "@pancakeswap/ui/components/AtomBox";
import { useIsomorphicLayoutEffect } from "framer-motion";
import React, { useCallback, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../Svg";
import { LeftMaskLayer, RightMaskLayer, SubMenuItemWrapper } from "./styles";
import { SubMenuItemsProps } from "./types";

const SUBMENU_CHEVRON_CLICK_MOVE_PX = 100;
const SUBMENU_SCROLL_DEVIATION = 3;

const SubMenuItems: React.FC<React.PropsWithChildren<SubMenuItemsProps>> = ({ isMobileOnly = false, ...props }) => {
  const scrollLayerRef = useRef<HTMLDivElement>(null);
  const chevronLeftRef = useRef<HTMLDivElement>(null);
  const chevronRightRef = useRef<HTMLDivElement>(null);
  const layerController = useCallback(() => {
    if (!scrollLayerRef.current || !chevronLeftRef.current || !chevronRightRef.current) return;
    const scrollLayer = scrollLayerRef.current;
    if (scrollLayer.scrollLeft !== 0) chevronLeftRef.current.classList.add("show");
    else chevronLeftRef.current.classList.remove("show");
    if (scrollLayer.scrollLeft + scrollLayer.offsetWidth < scrollLayer.scrollWidth - SUBMENU_SCROLL_DEVIATION)
      chevronRightRef.current.classList.add("show");
    else chevronRightRef.current.classList.remove("show");
  }, []);

  useIsomorphicLayoutEffect(() => {
    layerController();
  }, [layerController]);

  return (
    <AtomBox display={{ xs: "none", sm: "block" }} asChild>
      <SubMenuItemWrapper $isMobileOnly={isMobileOnly} {...props} mt="55px">
        <AtomBox display={{ xs: "block", md: "none" }} asChild>
          <LeftMaskLayer
            ref={chevronLeftRef}
            onClick={() => {
              if (!scrollLayerRef.current) return;
              scrollLayerRef.current.scrollLeft -= SUBMENU_CHEVRON_CLICK_MOVE_PX;
            }}
          >
            <ChevronLeftIcon />
          </LeftMaskLayer>
        </AtomBox>
        <AtomBox display={{ xs: "block", md: "none" }} asChild>
          <RightMaskLayer
            ref={chevronRightRef}
            onClick={() => {
              if (!scrollLayerRef.current) return;
              scrollLayerRef.current.scrollLeft += SUBMENU_CHEVRON_CLICK_MOVE_PX;
            }}
          >
            <ChevronRightIcon />
          </RightMaskLayer>
        </AtomBox>
      </SubMenuItemWrapper>
    </AtomBox>
  );
};

export default SubMenuItems;
